from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView, SpectacularSwaggerSplitView, SpectacularSwaggerView
)

from products.views import (
    ProductsAndRelatedVariationsView, FeaturedProductsListView, ProductDetailViewV4,
    ProductPreview, CategoryListView, ProductListByCategoryView
)
from order.views import OrderCreateView
from search.views import SearchProductItemView
# router = DefaultRouter()
# router.register(r'schema', SpectacularAPIView)
# router.register(r'schema/docs', SpectacularSwaggerView)

app_name = 'api'
urlpatterns = [
    path('products/latest/', ProductsAndRelatedVariationsView.as_view(), name='latest-products'),
    path('products/featured/', FeaturedProductsListView.as_view(), name='featured-products'),
    path('products/product-detail/<slug:slug>/', ProductDetailViewV4.as_view(), name='product-detail'),
    path('products/product-preview/<slug:slug>/', ProductPreview.as_view(), name='product-detail'),
    path('products/category/<int:category_id>', ProductListByCategoryView.as_view(), name='products-by-category'),

    path('categories/', CategoryListView.as_view(), name='categories'),

    path('orders/create', OrderCreateView.as_view(), name='order-create'),

    path('search/product-items/<str:query>', SearchProductItemView.as_view(), name='search-product-items'),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]


