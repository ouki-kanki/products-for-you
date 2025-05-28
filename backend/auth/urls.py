from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from rest_framework.routers import DefaultRouter


from .views import (
    MyTokenObtainPairView, DemoTokenObtainPairView,MyRefreshTokenObtainView,
    LogOutView, RegistrationView,
    ActivateUserView, view_activation_template,
    NotificationTestViewSet,
    ResendEmailView
)

router = DefaultRouter()
router.register(r'notifications', NotificationTestViewSet, basename='notification_test')

app_name = 'auth'
urlpatterns = [
    path('', include(router.urls)),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/demo', DemoTokenObtainPairView.as_view(), name='demo_token_obtain_pair'),
    path('token/refresh/', MyRefreshTokenObtainView.as_view(), name='token_refresh_view'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify_view'),
    path('logout/', LogOutView.as_view(), name='logout_user'),
    path('register/', RegistrationView.as_view(), name='register_user'),

    # TODO: change it and use it
    path('activate-user/<token>', ActivateUserView.as_view(), name='activate_user'),
    path('resend-email/<user_id>', ResendEmailView.as_view(), name='resend_email'),

    path('activation-form/', view_activation_template, name='get_activation_form'),
]
