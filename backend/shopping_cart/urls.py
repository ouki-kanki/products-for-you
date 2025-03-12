from django.urls import path
from .views import CartItemCreateView, GetUserCartApiView, CartDeleteApiView, CreateGuestCartView, GetSessionCartApiView

app_name = 'cart'
urlpatterns = [
    path('<int:pk>', GetUserCartApiView.as_view(), name='get_user_cart'),
    path('add', CartItemCreateView.as_view(), name='add_to_cart'),
    path('delete', CartDeleteApiView.as_view(), name='delete_cart'),
    path('add-session-cart', CreateGuestCartView.as_view(), name='add_to_session_cart'),
    path('get-session-cart', GetSessionCartApiView.as_view(), name='get-session-cart'),
]
