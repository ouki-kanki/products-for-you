from django.urls import path, include
from .views import ProductItemSearchView, ProductItemSuggestView
# from .views_old import SearchProductItemView, ProductItemsDocumentViewSet
from rest_framework import routers


# router = routers.DefaultRouter()
# router.register(
#     r'productitems',
#     ProductItemsDocumentViewSet,
#     basename='productitemdocument'
# )


app_name = 'search'
urlpatterns = [
    # url(r'^', include(router.urls)),
    path('product-items/', ProductItemSearchView.as_view(), name='search-product-items'),
    path('product-items/suggest/', ProductItemSuggestView.as_view(), name='suggest-product-items'),
]


# urlpatterns += router.urls
