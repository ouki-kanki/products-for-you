from django.urls import path, include
from .views import (
    LatestProductsView,
    FeaturedProductsListView,
    PromotedProductItemsListApiView,
    GetDefaultVariationsView,
    GetSimilarProductsView,
    ProductDetailViewV4,
    ProductPreview,
    ProductListByCategoryView,
    ProductListByCategoryBySlug,
    ProductQuantitiesForCartView
)


app_name = 'products'
urlpatterns = [
    path('latest/', LatestProductsView.as_view(), name='latest-products'),
    path('featured/', FeaturedProductsListView.as_view(), name='featured-products'),
    path('promoted/', PromotedProductItemsListApiView.as_view(), name='promoted-products'),
    path('default/', GetDefaultVariationsView.as_view(), name='default-product-items'),
    path('similar/', GetSimilarProductsView.as_view(), name='get-similar-products'),
    path('product-detail/<slug:slug>/', ProductDetailViewV4.as_view(), name='product-detail'),
    path('product-preview/<slug:slug>/', ProductPreview.as_view(), name='product-preview'),
    path('category/<int:category_id>', ProductListByCategoryView.as_view(), name='products-by-category-id'),
    path('category/<slug:slug>', ProductListByCategoryBySlug.as_view(), name='products-by-category-id'),
    path('quantities', ProductQuantitiesForCartView.as_view(), name='product-quantities'),
    path('promotions/', include('promotion.urls')),
    path('ratings/', include('ratings.urls'))
]
