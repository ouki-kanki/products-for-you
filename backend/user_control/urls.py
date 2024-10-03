from django.urls import path

from .views import (
    users_list_view, 
    users_detail_view, 
    UserProfileView
)

app_name = 'users'
urlpatterns = [
    path('', users_list_view, name="list"),
    path('<int:pk>', users_detail_view, name='detail'),
    path('profile/<int:user>', UserProfileView.as_view(), name='profile')
]
