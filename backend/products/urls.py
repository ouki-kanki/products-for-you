from django.urls import path

from .views import (
    product_list_view, product_item_list_view, category_list_view
)

urlpatterns = [
    # NOTE: testing (consumes product table along with related variations)
    path('', product_list_view),
    path('product-items/', product_item_list_view),
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