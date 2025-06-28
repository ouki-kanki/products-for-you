from django.urls import path, include
from .views import ProductItemSearchView, ProductItemSuggestView
from rest_framework import routers


app_name = 'search'
urlpatterns = [
    # url(r'^', include(router.urls)),
    path('product-items/', ProductItemSearchView.as_view(), name='search-product-items'),
    path('product-items/suggest/', ProductItemSuggestView.as_view(), name='suggest-product-items'),
]


