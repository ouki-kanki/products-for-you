from django.urls import path

from .views import (
    users_list_view, 
    users_detail_view,
    UserProfileView,
    UserProfileInsertView,
    UserProfileUpdate,
    UploadProfileImageView,
    FavoriteProductItemListView,
    FavoriteProductItemAddView,
    FavoriteProductItemDeleteView,
    OrdersListApiView
)


app_name = 'user_control'
urlpatterns = [
    path('', users_list_view, name="list"),
    path('<int:pk>', users_detail_view, name='detail'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/insert', UserProfileInsertView.as_view(), name='profile_insert'),
    path('profile/update', UserProfileUpdate.as_view(), name='profile_update'),
    path('profile/upload-image', UploadProfileImageView.as_view(), name='profile_image_upload'),
    path('favorite-products/', FavoriteProductItemListView.as_view(), name='favorite_product_list'),
    path('favorite-products/add', FavoriteProductItemAddView.as_view(), name='favorite_product_add'),
    path('favorite-products/remove', FavoriteProductItemDeleteView.as_view(), name='favorite_product_remove'),
    path('orders/', OrdersListApiView.as_view(), name='orders'),
]
