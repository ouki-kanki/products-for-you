from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination

from elasticsearch_dsl import Q

from products.serializers import ProductItemSerializer
from .documents import ProductItemDocument


class SearchProductItemView(APIView):
    serializer = ProductItemSerializer
    search_document = ProductItemDocument

    def get(self, request, query):
        try:
            q = Q(
                'multi_match',
                query=query,
                fields=[
                    'product.name',
                ],
                fuzziness='auto'
            ) & Q(
                'bool',
                should=[
                    Q('match', is_default=True)
                ],
                minimum_should_match=1
            )
            search = self.search_document.search().query(q)
            response = search.execute()
            serializer = self.serializer(response, many=True)

            return Response(serializer.data)
        except Exception as e:
            return HttpResponse(e, status=500)




