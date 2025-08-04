from django.urls import path
from .views import OrderCreateView, valkey_test_view

app_name = 'order'
urlpatterns = [
    # NOTE: testing (consumes product table along with related variations)
    path('create', OrderCreateView.as_view(), name='order-create'),
    path('test_valkey', valkey_test_view, name='order-create'),
]
