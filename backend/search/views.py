from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination

from elasticsearch_dsl import Q
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    OrderingFilterBackend,
    SearchFilterBackend,
    CompoundSearchFilterBackend
)

from .serializers import SearchProductItemsSerializer, SearchProductItemDocumentSerializer
from .documents.productitem import ProductItemDocumentOld, ProductItemDocument


def has_spaces(q):
    space = ' '
    for item in q:
        if item == space:
            return True
    return False


class ProductItemsDocumentViewSet(DocumentViewSet):

    document = ProductItemDocument
    serializer_class = SearchProductItemDocumentSerializer
    lookup_field = 'id'
    pagination_class = LimitOffsetPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    filter_backends = [
        FilteringFilterBackend,
        # OrderingFilterBackend,
        CompoundSearchFilterBackend
    ]

    search_fields = (
        'name',
        'slug',
        'categories'
    )

    filter_fields = {
        'name': 'name.raw',
        'slug': 'slug.raw',
        'categories': 'categories.raw'
    }

    def filter_queryset(self, queryset):
        search_query = self.request.query_params.get('search', None)
        queryset = queryset.filter('term', is_default=True)

        return super().filter_queryset(queryset)


class SearchProductItemView(APIView):
    serializer = SearchProductItemsSerializer
    search_document = ProductItemDocumentOld

    def get(self, request, query):
        q = ''
        try:
            if not has_spaces(query):
                print("isndei no spaces")
                q = Q(
                    {
                        "term": {
                            "product.name": query
                        },
                    }) | Q({
                        'term': {
                            "sku": query
                        }
                    }) & Q(
                    'bool',
                    should=[
                        Q('match', is_default=True),
                        Q('match', product_image__is_default=True)
                    ]
                )
            else:
                print('with spaces', print(has_spaces(query)))
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
                        Q('match', is_default=True),
                    ],
                    minimum_should_match=1
                ) & Q(
                    'nested',
                    path='product_image',
                    query=Q(
                        'bool',
                        should=[
                            Q('term', product_image__is_default=True),
                        ]
                    ),
                )

            search = self.search_document.search().query(q)
            response = search.execute()
            serializer = self.serializer(response, context={'request': request}, many=True)

            return Response(serializer.data)
        except Exception as e:
            return HttpResponse(e, status=500)



