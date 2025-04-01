from django.urls import path
from .views import CartCreateView, GetUserCartApiView, CartDeleteApiView, CreateGuestCartView, GetSessionCartApiView

app_name = 'cart'
urlpatterns = [
    path('<int:pk>', GetUserCartApiView.as_view(), name='get_user_cart'),
    path('add', CartCreateView.as_view(), name='create_cart'),
    path('delete', CartDeleteApiView.as_view(), name='delete_cart'),

    # TODO: these are obsolete - delete the views and the serializers
    path('add-session-cart', CreateGuestCartView.as_view(), name='add_to_session_cart'),
    path('get-session-cart', GetSessionCartApiView.as_view(), name='get-session-cart'),
]
