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
    FavoriteProductItemDeleteView
)

app_name = 'user_control'
urlpatterns = [
    path('', users_list_view, name="list"),
    path('<int:pk>', users_detail_view, name='detail'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/insert', UserProfileInsertView.as_view(), name='profile_insert'),
    path('profile/update', UserProfileUpdate.as_view(), name='profile_update'),
    path('profile/upload-image', UploadProfileImageView.as_view(), name='profile_image_upload'),
    path('favorite-product/', FavoriteProductItemListView.as_view(), name='favorite_product_list'),
    path('favorite-product/add/<slug:slug>', FavoriteProductItemAddView.as_view(), name='favorite_product_add'),
    path('favorite-product/remove/<slug:slug>', FavoriteProductItemDeleteView.as_view(), name='favorite_product_remove'),
]
