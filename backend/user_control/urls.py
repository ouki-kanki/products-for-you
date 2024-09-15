from django.urls import path

from .views import (
    users_list_view, 
    users_detail_view, 
    custom_auth_token,
    registration_view,
    UserProfileView
)

app_name = 'users'
urlpatterns = [
    path('', users_list_view, name= "list"),
    path('token-auth', custom_auth_token, name='login'),
    path('register', registration_view, name='register'),
    # TODO: this fetches from the user model have to change the name
    path('<int:pk>', users_detail_view, name= 'detail'),
    path('profile/<int:user>', UserProfileView.as_view(), name='profile')
]
