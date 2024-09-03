from functools import cached_property
from math import ceil

from django.core import paginator as django_paginator
from elasticsearch_dsl.utils import AttrDict
from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination, BasePagination

from rest_framework import pagination
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

import six


class ElasticSearchPaginator(django_paginator.Paginator):

    def __init__(self, *args, **kwargs):
        super(ElasticSearchPaginator, self).__init__(*args, **kwargs)
        self._count = self.object_list.hits.total

    def page(self, number):
        number = self.validate_number(number)
        return django_paginator.Page(self.object_list, number, self)

    @cached_property
    def num_pages(self):
        if self.count == 0 and not self.allow_empty_first_page:
            return 0
        hits = max(1, self._count.value - self.orphans)
        return ceil(hits / self.per_page)


class ElasticSearchPagination(PageNumberPagination):

    django_paginator_class = ElasticSearchPaginator


class GetCountMixin:

    def get_es_count(self, es_response):  # noqa
        if isinstance(es_response, list):
            return len(es_response)
        if isinstance(es_response.hits.total, AttrDict):
            return es_response.hits.total.value
        return es_response.hits.total


class Page(django_paginator.Page, GetCountMixin):
    """Page for elasticsearch"""
    def __init__(self, object_list, number, paginator, facets):
        self.facets = facets
        self.count = self.get_es_count(object_list) # the response from elasticsearch -> object_list
        super(Page, self).__init__(object_list, number, paginator)


class Paginator(django_paginator.Paginator):
    """Paginator for elastic Search"""

    def page(self, number):
        """
        Returns a Page object for the given 1-based page number
        :param number:
        """
        number = self.validate_number(number)
        bottom = (number - 1) * self.per_page
        top = bottom + self.per_page
        if top + self.orphans >= self.count:
            top = self.count
        object_list = self.object_list[bottom:top].execute()
        __facets = getattr(object_list, 'aggregations', None)
        return self._get_page(object_list, number, self, facets=__facets)

    def _get_page(self, *args, **kwargs):
        return Page(*args, **kwargs)


class PageNumberPagination(pagination.PageNumberPagination, GetCountMixin):
    """Page number pagination.

    A simple page number based style that supports page numbers as
    query parameters.

    Example:

        http://api.example.org/accounts/?page=4
        http://api.example.org/accounts/?page=4&page_size=100
    """

    django_paginator_class = Paginator

    def __init__(self, *args, **kwargs):
        """Constructor.

        :param args:
        :param kwargs:
        """
        self.facets = None
        # self.page = None
        # self.request = None
        self.count = None
        super(PageNumberPagination, self).__init__(*args, **kwargs)

    def get_facets(self, page=None):
        """Get facets.

        :param page:
        :return:
        """
        if page is None:
            page = self.page

        if hasattr(page, 'facets') and hasattr(page.facets, '_d_'):
            return page.facets._d_

    def paginate_queryset(self, queryset, request, view=None):
        """Paginate a queryset.

        Paginate a queryset if required, either returning a page object,
        or `None` if pagination is not configured for this view.

        :param queryset:
        :param request:
        :param view:
        :return:
        """
        # TODO: It seems that paginator breaks things. If take out, queries
        # doo work.
        # Check if there are suggest queries in the queryset,
        # ``execute_suggest`` method shall be called, instead of the
        # ``execute`` method and results shall be returned back immediately.
        # Placing this code at the very start of ``paginate_queryset`` method
        # saves us unnecessary queries.
        is_suggest = getattr(queryset, '_suggest', False)
        if is_suggest:
            return queryset.execute().to_dict().get('suggest')

        # Check if we're using paginate queryset from `functional_suggest`
        # backend.
        if view.action == 'functional_suggest':
            return queryset

        # If we got to this point, it means it's not a suggest or functional
        # suggest case.

        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        page_number = request.query_params.get(self.page_query_param, 1)
        if page_number in self.last_page_strings:
            page_number = paginator.num_pages

        # Something weird is happening here. If None returned before the
        # following code, post_filter works. If None returned after this code
        # post_filter does not work. Obviously, something strange happens in
        # the paginator.page(page_number) and thus affects the lazy
        # queryset in such a way, that we get TransportError(400,
        # 'parsing_exception', 'request does not support [post_filter]')
        try:
            self.page = paginator.page(page_number)
        except django_paginator.InvalidPage as exc:
            msg = self.invalid_page_message.format(
                page_number=page_number, message=six.text_type(exc)
            )
            raise NotFound(msg)

        if paginator.num_pages > 1 and self.template is not None:
            # The browsable API should display pagination controls.
            self.display_page_controls = True

        self.request = request
        return list(self.page)

    def get_paginated_response_context(self, data):
        """Get paginated response data.

        :param data:
        :return:
        """
        __data = [
            ('count', self.page.count),
            # ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
        ]
        __facets = self.get_facets()
        if __facets is not None:
            __data.append(
                ('facets', __facets),
            )
        __data.append(
            ('results', data),
        )
        return __data

    def get_paginated_response(self, data):
        """Get paginated response.

        :param data:
        :return:
        """
        return Response(OrderedDict(self.get_paginated_response_context(data)))
