from django.urls import path

from .views import (
    product_list_view, product_item_list_view, category_list_view, product_item_detail_view, product_detail_related_variations_view,
    category_detail_related_products_view,
    product_and_featured_variation_view,
    product_and_featured_variation_view_V3,
    product_and_last_created_variations_view_V3,
    latest_products_view_with_page,
    latest_featured_variations_with_page,
    get_product_and_parent_categories_view,
    featured_products_view,
    get_brand_view,
    products_and_related_variations_view,
    product_detail_view_v4,
    product_preview,
    product_search_view,
    products_list_by_category_view
)

app_name = 'products'
urlpatterns = [
    # NOTE: testing (consumes product table along with related variations)
    path('', product_list_view),
    path('search/', product_search_view, name='product-search'),
    
    # in_use
    path('latest-products-v4/', products_and_related_variations_view),
    path('featured-products', featured_products_view),
    path('latest-products', latest_featured_variations_with_page),
    path('latest', latest_products_view_with_page),
    path('products-categories', get_product_and_parent_categories_view),
    path('featured', product_and_featured_variation_view),
    path('featured-v3', product_and_featured_variation_view_V3),

    # in use to fetch categories
    path('categories', category_list_view),
    path('brands', get_brand_view),
    path('last_variations-v3', product_and_last_created_variations_view_V3),
    
    # in_use to fetch product_detail
    path('product-items-detail-v4/<slug:slug>/', product_detail_view_v4, name='product-item-detail'),

    path('product-item-preview-v4/<slug:slug>/', product_preview, name='product-preview'),
    path('<slug:slug>-<int:pk>', product_detail_related_variations_view, name='product_detail'),
    path('product-items/', product_item_list_view, name='product-items-list'), # lists the variations
    # path('product-items/<slug:slug>/', product_item_detail_view, name='product_item-detail'), # lists the variations
    path('categories/<slug:slug>/', category_detail_related_products_view),
    path('by-category/<int:category_id>', products_list_by_category_view, name='product_list_by_category')
]
