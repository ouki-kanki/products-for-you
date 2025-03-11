from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView, SpectacularSwaggerSplitView, SpectacularSwaggerView
)

from products.views import (
    ProductsAndRelatedVariationsView, FeaturedProductsListView, ProductDetailViewV4,
    ProductPreview, CategoryListView, CategoryFeaturedListView,
    ProductListByCategoryView, GetDefaultVariationsView,
    ProductListByCategoryBySlug,
    PromotedProductItemsListApiView,
    LandingPageView,
    GetSimilarProductsView
)
from order.views import OrderCreateView


app_name = 'api'
urlpatterns = [
    path('products/latest/', ProductsAndRelatedVariationsView.as_view(), name='latest-products'),
    path('products/featured/', FeaturedProductsListView.as_view(), name='featured-products'),
    path('products/promoted/', PromotedProductItemsListApiView.as_view(), name='promoted-products'),
    path('products/default/', GetDefaultVariationsView.as_view(), name='default-product-items'),
    path('products/similar/', GetSimilarProductsView.as_view(), name='get-similar-products'),
    path('products/product-detail/<slug:slug>/', ProductDetailViewV4.as_view(), name='product-detail'),
    path('products/product-preview/<slug:slug>/', ProductPreview.as_view(), name='product-preview'),
    path('products/category/<int:category_id>', ProductListByCategoryView.as_view(), name='products-by-category-id'),
    path('products/category/<slug:slug>', ProductListByCategoryBySlug.as_view(), name='products-by-category-id'),
    path('products/promotions/', include('promotion.urls')),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('categories/featured', CategoryFeaturedListView.as_view(), name='categories'),

    path('orders/create', OrderCreateView.as_view(), name='order-create'),
    path('cart/', include('shopping_cart.urls')),
    path('/payment/', include('payments.urls')),

    path('auth/', include('auth.urls')),
    path('user-control/', include('user_control.urls')),
    path('search/', include('search.urls')),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]


