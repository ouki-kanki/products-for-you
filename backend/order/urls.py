from django.urls import path
from .views import order_create_view

app_name = 'order'
urlpatterns = [
    # NOTE: testing (consumes product table along with related variations)
    path('create', order_create_view, name='order-create'),
]