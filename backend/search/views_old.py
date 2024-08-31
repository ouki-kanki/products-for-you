from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination

from elasticsearch_dsl import Q

from django_elasticsearch_dsl_drf.constants import (
    SUGGESTER_COMPLETION,
    SUGGESTER_PHRASE,
    SUGGESTER_TERM,
    FUNCTIONAL_SUGGESTER_COMPLETION_MATCH,
    FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX,
    FUNCTIONAL_SUGGESTER_PHRASE_MATCH,
    FUNCTIONAL_SUGGESTER_TERM_MATCH
)
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet, BaseDocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    OrderingFilterBackend,
    CompoundSearchFilterBackend,
    SuggesterFilterBackend,
    FunctionalSuggesterFilterBackend
)

from .serializers_old import SearchProductItemsSerializer, SearchProductItemDocumentSerializer
from .documents.productitem_dsl_drf import ProductItemDocument
from .documents.produtitem_elastic_8 import ProductItemDocumentOld


def has_spaces(q):
    for item in q:
        if item == ' ':
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
        CompoundSearchFilterBackend,
        FunctionalSuggesterFilterBackend,
        SuggesterFilterBackend,
    ]

    search_fields = (
        'name',
        'slug',
        'categories'
    )

    filter_fields = {
        'id': None,
        'name': 'name.raw',
        'slug': 'slug.raw',
        'categories': 'categories.raw'
    }

    suggester_fields = {
        'name.suggest': {
            'suggesters': [
                SUGGESTER_COMPLETION,
            ]
        },
        'slug.suggest': {
            'suggesters': [
                SUGGESTER_COMPLETION,
            ]
        },
        'name_suggest': {
            'field': 'name.suggest',
            'suggesters': [
                SUGGESTER_TERM,
                SUGGESTER_PHRASE,
                SUGGESTER_COMPLETION,
                # FUNCTIONAL_SUGGESTER_COMPLETION_MATCH,
                # FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX
            ],
            'default_suggester': SUGGESTER_COMPLETION,
        },
        'slug_suggest': {
            'field': 'slug.suggest',
            'suggesters': [
                SUGGESTER_COMPLETION,
                SUGGESTER_TERM,
                # SUGGESTER_PHRASE,
            ],
            'default_suggester': SUGGESTER_COMPLETION
        },
        'categories_suggest': {
            'field': 'categories.suggest',
            'suggesters': [
                SUGGESTER_COMPLETION,
            ]
        }
    }

    # functional_suggester_fields = {
    #     'name_suggest': {
    #         'field': 'name.raw',
    #         'suggesters': [
    #             FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX
    #         ],
    #         'default_suggester': FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX
    #     },
    #     'slug_suggest': {
    #         'field': 'slug.raw',
    #         'suggesters': [
    #             FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX
    #         ],
    #         'default_suggester': FUNCTIONAL_SUGGESTER_COMPLETION_PREFIX
    #     }
    # }

    def filter_queryset(self, queryset):
        search_query = self.request.query_params.get('search', None)
        # queryset = queryset.filter('term', is_default=True)

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



