from django.urls import path, include

from .views import SearchProductItemView, ProductItemsDocumentViewSet
from rest_framework import routers


router = routers.DefaultRouter()
router.register(
    r'productitems',
    ProductItemsDocumentViewSet,
    basename='productitemdocument'
)


app_name = 'search'
urlpatterns = [
    # url(r'^', include(router.urls)),
    path('product-items/<str:query>', SearchProductItemView.as_view(), name='search-product-items'),
]


urlpatterns += router.urls
