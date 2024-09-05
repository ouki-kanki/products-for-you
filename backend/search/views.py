from pprint import pprint
from django.conf import settings
from django.core.paginator import PageNotAnInteger, EmptyPage
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView

from elasticsearch_dsl import Q, Search, FacetedSearch, TermsFacet, DateHistogramFacet
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
        'name': TermsFacet(field='name')
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
        s.query(q)
        return s

    # def query(self, search, query):
    #     print("overriden query")
    #     search = self.search()  # returns the search obj
    #     custom_q = super().query(search, query)
    #     return custom_q


class ProductItemSearchView(APIView, ElasticSearchPagination):
    """
    get list of ProductItem objects
    search-by: broduct name category
    pagination: pageNumberPagination
    """
    serializer = SearchProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request): # noqa
        search_str = request.query_params.get('search')
        sort_by = request.query_params.get('sort_by')

        try:
            q = Q(
                'multi_match',
                query=search_str,
                fields=[
                    'name',
                    'slug',
                    'categories',
                    'description'
                ],
                fuzziness='auto'
            )

            uri = request.build_absolute_uri(request.path)
            default_page = '1'
            default_page_size = settings.PAGE_SIZE

            page = int(request.query_params.get('page', default_page))
            page_size = int(request.query_params.get('page_size', default_page_size))

            if page_size <= 0 or page_size > settings.MAX_PAGE_SIZE_LIMIT:
                page_size = default_page_size

            start = (page - 1) * page_size
            end = start + page_size

            # search = self.search_document.search().query(q)[start:end]
            # search = self.search().query(q)[start:end]

            air_name = 'dualshock 4'
            filters = {
                "name": ['Air Jordan', 'headhunter']
            }

            sort_term = None
            if sort_by:
                sort_term = [sort_hash.get(sort_by, ''),]

            fc = ProductsFacetedSearch(
                query=search_str,
                filters=filters,
                sort=sort_term
            )

            fc = fc[start:end]
            response = fc.execute()
            # print("the response", response.to_dict())
            # print("facets", response.facets)

            for item in response.facets:
                print(item.count)

            # search = fc.search()
            # yo = fc.query(search, q)
            # res2 = yo.execute()
            # pprint(res2.to_dict())


            # response = bs.execute()

            # name_facets = [
            #     {'key': bucket.key, 'doc_count': bucket.doc_count}
            #     for bucket in response.aggregations.name.buckets
            # ]

            for (name, count, selected) in response.facets.name:
                print("the name facet group", name, count, selected)

            # print("name_facets", name_facets)

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

            paged_response = {
                'next': next_link,
                'prev': prev_link,
                'total_items': paginator._count.value,
                'per_page': paginator.count,
                'num_of_pages': paginator.num_pages,
                'results': serializer.data
            }

            return Response(paged_response)
        except Exception as e:
            return HttpResponse(e, status=500)


class ProductItemSuggestView(APIView):
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
