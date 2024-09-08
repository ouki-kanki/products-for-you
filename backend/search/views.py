from pprint import pprint
from django.db.models import F
from django.conf import settings
from django.core.paginator import PageNotAnInteger, EmptyPage
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from elasticsearch_dsl import (
    Q, Search, FacetedSearch, TermsFacet,
    DateHistogramFacet, RangeFacet
)
from elasticsearch_dsl.query import Match, Term

from .serializers import SearchProductItemSerializer
from .documents.productitem import ProductItemDocument
from common.paginators.paginator_elasticsearch import ElasticSearchPaginator, ElasticSearchPagination

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

    facets = {
        'name': TermsFacet(field='name'),
        'price': RangeFacet(field='price', ranges=[
            ('0 - 100', (0.01, 100)),
            ('100 - 2000', (100, 2000)),
            ('> 2000', (2000, None))
        ])
    }

    def search(self):
        """ add facets """
        s = super().search()
        print("inside the overriden search")
        q = Q(
            'multi_match',
            query=self.query,
            fields=[
                'name',
                'slug',
                'categories',
            ],
            fuzziness='AUTO'
        )
        print("inside searhc --- - - ")

        price_filter = F({'range': {'price': {'gte': 100, 'lte': 2000}}})
        # s.filter(price_filter)
        # s.filter('range', **{'price': {'from': 100, "to": 1000}})
        # s.filter('match', **{'name': 'Air Jordan'})
        s.query(q)
        return s


class ProductItemSearchView(APIView, ElasticSearchPagination):
    """ search - faceted-search """
    serializer = SearchProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request): # noqa
        search_str = request.query_params.get('search')
        sort_by = request.query_params.get('sort_by')
        name = request.query_params.getlist('name')
        price = request.query_params.getlist('price')

        filters = {
            'name': name,
            'price': price
        }

        query_list = request.GET.urlencode()
        query_ar = query_list.split('&')

        for item in query_ar:
            itemArr = item.split('=')
            item_dict = {itemArr[0]: itemArr[1]}
            # print("the item dict", item_dict)

        try:
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

            print("filter: ", filters)
            fc = ProductsFacetedSearch(
                query=search_str,
                filters=filters,
                sort=sort_term
            )

            fc = fc[start:end]
            response = fc.execute()
            # print("facets", response.facets)

            # for (name, count, selected) in response.facets.name:
            #     print("the name facet group", name, count, selected)

            paginator = ElasticSearchPaginator(response, page_size)

            next_link = None
            prev_link = None
            if page < paginator.num_pages:
                next_link = f'{uri}/?search={search_str}&page={page + 1}&page_size={page_size}'
            if page > 1:
                prev_link = f'{uri}/?search={search_str}&page={page - 1}&page_size={page_size}'

            try:
                posts = paginator.page(page)
            except PageNotAnInteger:
                posts = paginator.page(1)
            except EmptyPage:
                posts = paginator.page(paginator.num_pages)

            serializer = self.serializer(posts, context={'request': request}, many=True)

            paged_response_with_facets = {
                'next': next_link,
                'prev': prev_link,
                'total_items': paginator._count.value,
                'per_page': paginator.count,
                'num_of_pages': paginator.num_pages,
                'results': serializer.data,
                'facets': response.facets.to_dict()
            }

            # print(response.facets.to_dict())

            return Response(paged_response_with_facets)
        except Exception as e:
            return HttpResponse(e, status=500)


class ProductItemSuggestView(APIView):
    """ input: productName or category out: products"""
    # TODO: when input is category suggest categories
    serializer = SearchProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request):
        try:
            param = request.query_params.get('suggest')
            # suggest = self.search_document.search().suggest('slug_suggestion', param, completion={'field': 'slug.suggest'})

            suggest_with_categories = Search(index='productitem').suggest(
                'cat_suggestion',
                param,
                completion={
                    'field': 'categories.suggest',
                    'fuzzy': {
                        'fuzziness': 2
                    },
                    "size": 5
                }
            ).suggest(
                'slug_suggestion',
                param,
                completion={
                    'field': 'slug_suggest',
                    'fuzzy': {
                        'fuzziness': 2
                    },
                    "size": 5
                }
            )

            response = suggest_with_categories.source(['slug_suggest', 'categories']).execute()
            # pprint(response_from_categories.to_dict())

            suggestions = [
                ''.join(option._source.slug_suggest.input) for option in response.suggest.slug_suggestion[0].options
                if response.suggest.slug_suggestion[0].options] # noqa

            print("suggestions from slug", suggestions)
            suggestions += [
                ''.join(option._source.slug_suggest.input) for option in response.suggest.cat_suggestion[0].options
                if response.suggest.cat_suggestion[0].options] # noqa

            # print(response.to_dict())

            return Response(suggestions)

        except Exception as e:
            return HttpResponse(e, status=500)
