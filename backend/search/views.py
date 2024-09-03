from pprint import pprint
from django.conf import settings
from django.core.paginator import PageNotAnInteger, EmptyPage
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination

from elasticsearch_dsl import Q, Search
from elasticsearch_dsl.query import Match, Term

from .serializers import SearchProductItemSerializer
from .documents.productitem import ProductItemDocument
from common.paginators.paginator_elasticsearch import ElasticSearchPaginator, ElasticSearchPagination


class ProductItemSearchView(APIView, ElasticSearchPagination):
    serializer = SearchProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request): # noqa
        query = request.query_params.get('search')
        print("the params", query)
        q = ''
        try:
            q = Q(
                'multi_match',
                query=query,
                fields=[
                    'name',
                    'slug',
                    'categories',
                    'description'
                ],
                fuzziness='auto'
            )

            uri = request.build_absolute_uri(request.path)
            page = int(request.query_params.get('page', '1'))
            # if there is no page_size get default from settings
            page_size = int(request.query_params.get('page_size', settings.PAGE_SIZE))

            start = (page - 1) * page_size
            end = start + page_size

            # print("the page", page, start, end)

            search = self.search_document.search().query(q)[start:end]
            response = search.execute()

            paginator = ElasticSearchPaginator(response, page_size)

            next_link = None
            prev_link = None
            if page < paginator.num_pages:
                next_link = f'{uri}/?search={query}&page={page + 1}&page_size={page_size}'
            if page > 1:
                prev_link = f'{uri}/?search={query}&page={page - 1}&page_size={page_size}'

            try:
                posts = paginator.page(page)
            except PageNotAnInteger:
                posts = paginator.page(1)
            except EmptyPage:
                print(paginator)
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
