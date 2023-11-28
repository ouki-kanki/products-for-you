from django.urls import path

from .views import (
    product_list_view, product_item_list_view, category_list_view, product_item_detail_view, product_detail_related_variations_view,
    category_detail_related_products_view,
    product_and_featured_variation_view
)

app_name = 'products'
urlpatterns = [
    # NOTE: testing (consumes product table along with related variations)
    path('', product_list_view), # lists the products,
    path('yo', product_and_featured_variation_view),
    path('<slug:slug>', product_detail_related_variations_view, name='product_detail'),
    path('product-items/', product_item_list_view, name='product-items-list'), # lists the variations
    path('product-items/<slug:slug>/', product_item_detail_view, name='product_item-detail'), # lists the variations
    path('categories/', category_list_view),
    path('categories/<slug:slug>/', category_detail_related_products_view)
]


# products = [
#     {
#         name: ''
#         category: '',
#         description: '',
#         icon: ''
#         variations: [
#             sku: '',
#             quantity: '',
#             price: null
#         ]
#     }
# ]