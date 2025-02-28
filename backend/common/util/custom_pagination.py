from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework.response import Response


class CursorSetPagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    ordering = '-created_at'


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100
    page_size = 10

    def get_paginated_response(self, data):
        total_pages = self.page.paginator.num_pages
        response = super().get_paginated_response(data)
        response.data['num_of_pages'] = total_pages
        return response

