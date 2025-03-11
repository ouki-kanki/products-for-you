from django.urls import path
from .views import StripeCheckoutAPIView

urlpatterns = [
    path('create-checkout-session', StripeCheckoutAPIView.as_view(), name='stripe_checkout_view'),
]
