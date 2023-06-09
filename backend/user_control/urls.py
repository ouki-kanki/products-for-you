from django.urls import path

from .views import (
    users_list_view, users_detail_view, custom_auth_token
)

app_name = 'users'
urlpatterns = [
    path('', users_list_view, name= "list"),
    path('token-auth', custom_auth_token, name='login'),
    path('<int:pk>', users_detail_view, name= "detail"),
]
 