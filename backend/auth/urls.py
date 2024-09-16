from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import MyTokenObtainPairView, MyRefreshTokenObtainView


app_name = 'auth'
urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyRefreshTokenObtainView.as_view(), name='token_refresh_view'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify_view'),
]
