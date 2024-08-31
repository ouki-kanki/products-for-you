from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.generics import GenericAPIView

from elasticsearch_dsl import Q, Search
from elasticsearch_dsl.query import Match, Term

from .serializers import SearchProductItemSerializer
from .documents.productitem import ProductItemDocument


class ProductItemSearchView(APIView):
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

            # suggest = self.search_document.search().suggest('name_suggestion', query, completion={'field': 'slug.suggest'})
            # response = suggest.execute()

            search = self.search_document.search().query(q)
            response = search.execute()
            serializer = self.serializer(response, context={'request': request}, many=True)

            return Response(serializer.data)
        except Exception as e:
            return HttpResponse(e, status=500)


class ProductItemSuggestView(APIView):
    serializer = SearchProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request):
        try:
            param = request.query_params.get('suggest')
            # suggest = self.search_document.search().suggest('name_suggestion', param, completion={'field': 'slug.suggest'})
            # print("suggest", suggest)

            suggest = Search(index='productitem').suggest(
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

            response = suggest.execute()
            suggestions = [option._source.slug for option in response.suggest.slug_suggestion[0].options]

            return Response(suggestions)

        except Exception as e:
            return HttpResponse(e, status=500)
