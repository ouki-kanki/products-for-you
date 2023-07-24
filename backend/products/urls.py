from django.urls import path

from .views import (
    product_list_view, product_item_list_view, category_list_view, product_item_detail_view
)

# app_name = 'products'
urlpatterns = [
    # NOTE: testing (consumes product table along with related variations)
    path('', product_list_view), # lists the products
    path('product-items/', product_item_list_view, name='product-items-list'), # lists the variations
    path('product-items/<slug:slug>/', product_item_detail_view, name='product_item-detail'), # lists the variations
    path('categories/', category_list_view)
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