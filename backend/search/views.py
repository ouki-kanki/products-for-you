from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination

from elasticsearch_dsl import Q

from products.serializers import ProductItemSerializer
from .serializers import SearchProductItemsSerializer
from .documents import ProductItemDocument


def has_spaces(q):
    space = ' '
    for item in q:
        if item == space:
            return True
    return False


class SearchProductItemView(APIView):
    serializer = SearchProductItemsSerializer
    search_document = ProductItemDocument

    def get(self, request, query):
        q = ''
        try:
            if not has_spaces(query):
                q = Q(
                    {
                        "term": {
                            "product.name": query
                        },
                    }) | Q({
                        'term': {
                            "sku": query
                        }
                    })
            else:
                q = Q(
                    'multi_match',
                    query=query,
                    fields=[
                        'product.name',
                        'detailed_description',
                        'categories'
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




