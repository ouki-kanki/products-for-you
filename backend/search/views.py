from typing import List
from urllib.parse import urlencode
from django.conf import settings
from django.core.paginator import PageNotAnInteger, EmptyPage
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


from elasticsearch_dsl import (
    Q, Search, FacetedSearch, TermsFacet,
    DateHistogramFacet, RangeFacet, NestedFacet
)
from elasticsearch_dsl.query import Match, Term
from elasticsearch_dsl.exceptions import ElasticsearchDslException

from common.paginators.paginator_elasticsearch import ElasticSearchPaginator, ElasticSearchPagination
from .serializers import SearchProductItemSerializer
from .documents.productitem import ProductItemDocument
from .documents.category_document import CategoryDocument
from .utils.pagination import paginate

sort_hash = {
    'time': 'created_at',
    'time desc': '-created_at',
    'price': 'price',
    'price desc': '-price',
    'name': 'name',
    'name desc': '-name'
}


class ProductsFacetedSearch(FacetedSearch):
    doc_types = [ProductItemDocument, ]
    # fields = ['name', 'price',]
    serializer = SearchProductItemSerializer
    index = 'productitem'

    def __init__(self, query, filters, sort, category=None):
        self.category = category
        super().__init__(query, filters, sort)

    facets = {
        'name': TermsFacet(field='name'),
        'brand': TermsFacet(field='brand'),
        'categories': TermsFacet(field='categories.raw'),
        'price': RangeFacet(field='price', ranges=[
            ('0 - 100', (0.01, 100)),
            ('100 - 2000', (100, 2000)),
            ('> 2000', (2000, None))
        ])
    }

    def search(self):
        # add facets
        s = super().search()
        q = Q(
            'multi_match',
            query=self.query,
            fields=[
                'name.raw',
                'variation_name_suggest',
                'slug.raw',
                'categories.raw',
            ],
            fuzziness='AUTO',
            type='best_fields'
        )

        # NOTE: this is left for testing
        # price_filter = F({'range': {'price': {'gte': 100, 'lte': 2000}}})
        # s.filter(price_filter)
        # s.filter('range', **{'price': {'from': 100, "to": 1000}})
        # s.filter('match', **{'name': 'Air Jordan'})

        # NOTE: this is left for testing
        if self.category:
            s = s.filter('match', **{'categories': self.category[0]})

        s.query(q)
        return s


class ProductItemSearchView(APIView, ElasticSearchPagination):
    """ search - faceted-search """
    serializer = SearchProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request):  # pylint: disable=too-many-locals
        search_str = request.query_params.get('search')
        sort_by = request.query_params.get('sort_by')
        name = request.query_params.getlist('name')
        price = request.query_params.getlist('price')
        category = request.query_params.getlist('categories')
        brand = request.query_params.getlist('brand')

        filters = {
            'name': name,
            'price': price,
            'brand': brand,
            'categories': category
        }

        try:

            # pagination = paginate(request, search_str, fc,)
            # posts, items_per_page = pagination.get('posts'), pagination.get('items_per_page')
            # total_items, num_of_pages = pagination.get('total_items'), pagination.get('num_of_pages')
            # prev_link, next_link = pagination.get('prev_link'), pagination.get('next_link')

            # --**-- pagination --**--
            uri = request.build_absolute_uri(request.path)
            default_page = '1'
            default_page_size = settings.PAGE_SIZE

            page = int(request.query_params.get('page', default_page))
            page_size = int(request.query_params.get('page_size', default_page_size))

            if page_size <= 0 or page_size > settings.MAX_PAGE_SIZE_LIMIT:
                page_size = default_page_size

            start = (page - 1) * page_size
            end = start + page_size

            sort_term = None
            if sort_by:
                sort_term = [sort_hash.get(sort_by, ''),]

            fc = ProductsFacetedSearch(
                query=search_str,
                filters=filters,
                sort=sort_term,
                category=category
            )

            fc = fc[start:end]
            response = fc.execute()
            # print("facets", response.facets)

            # for (name, count, selected) in response.facets.name:
            #     print("the name facet group", name, count, selected)

            paginator = ElasticSearchPaginator(response, page_size)

            # print("facets", response.facets.to_dict())

            facets_dict = response.facets.to_dict()

            def build_facets_query(facets):
                active_dict = {}
                for key, values in facets.items():
                    active_values = [items[0] for items in values if items[2]]
                    if active_values:
                        active_dict[key] = ",".join(active_values)
                return f'&{urlencode(active_dict)}' if active_dict else ''

            facets_query = build_facets_query(facets_dict)
            print("facets_query: ", facets_query)

            next_link = None
            prev_link = None
            if page < paginator.num_pages:
                next_link = f'{uri}?search={search_str}&page={page + 1}&page_size={page_size}{facets_query}'
            if page > 1:
                prev_link = f'{uri}?search={search_str}&page={page - 1}&page_size={page_size}{facets_query}'

            try:
                posts = paginator.page(page)
            except PageNotAnInteger:
                posts = paginator.page(1)
            except EmptyPage:
                posts = paginator.page(paginator.num_pages)

            serializer = self.serializer(posts, context={'request': request}, many=True)

            # print("serializer data", json.dumps(serializer.data, indent=4))

            print("the next link", next_link)
            print("prev link", prev_link)
            # TODO: had to access protected member,
            paged_response_with_facets = {
                'next': next_link,
                'prev': prev_link,
                # 'total_items': total_items,  # pylint: disable=protected-access
                'total_items': paginator._count.value,  # pylint: disable=protected-access
                # 'per_page': items_per_page,
                'per_page': paginator.count,
                # 'num_of_pages': num_of_pages,
                'num_of_pages': paginator.num_pages,
                'results': serializer.data,
                # 'facets': pagination.get('facets_response').facets.to_dict()
                'facets': response.facets.to_dict()
            }

            # print(response.facets.to_dict())

            return Response(paged_response_with_facets)
        except Exception as e:
            return HttpResponse(e, status=500)


class ProductItemSuggestView(APIView):

    @staticmethod
    def get_suggestions(suggestion_obj: Search, *index_names) -> List[str]:
        suggestions = suggestion_obj.execute()
        suggestions = suggestions.suggest

        suggestions_list = []
        for index_name in index_names:
            suggestions_list += suggestions[index_name][0]['options']

        options = [option.to_dict() for option in suggestions_list]

        return [option['text'] for option in options]

    def get(self, request):
        try:
            param = request.query_params.get('suggest')

            # substring matching variation names
            variations = ProductItemDocument.search().query(
                'match', variation_name_suggest=param
            )
            variations_res = variations.execute()
            # print("variatio neams dump", json.dumps(variations_res.to_dict(), indent=4))

            suggestions = [hit['_source']['variation_name_suggest']
                           for hit in variations_res['hits']['hits']]

            # slug suggestions for the items
            items = ProductItemDocument.search()
            items: Search = items.suggest(
                'slug_suggestion',
                param,
                completion={
                    "field": 'slug_suggest',
                    "fuzzy": {
                        'fuzziness': 'AUTO'
                    },
                    'size': 5
                }
            ).suggest(
                'brand_suggestion',
                param,
                completion={
                    "field": 'brand.suggest',
                    'size': 1 # keep the number of results 1 because it will find the related brands of many broducts and i want only one to show in suggestion
                },
            )

            suggestions += self.get_suggestions(items, 'slug_suggestion', 'brand_suggestion')

            # category suggestions
            categories = CategoryDocument.search()
            categories = categories.suggest(
                'categories_suggestion',
                param,
                completion={
                    "field": 'name_suggest',
                    'fuzzy': {
                        'fuzziness': 'AUTO'
                    },
                    'size': 5
                }
            )

            suggestions += self.get_suggestions(categories, 'categories_suggestion')

            print("suggestions", suggestions)

            return Response(suggestions)
        except KeyError as e:
            return Response({
                "message": f"key error: {str(e)}"
            })
        except (ValueError, TypeError) as e:
            return Response({
                "message": f"input error: {str(e)}"
            })
        except ElasticsearchDslException as e:
            return Response({
                "message": f"elastic error: {str(e)}"
            })
        except Exception as e:  # pylint: disable=broad-except
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
