from django.urls import path
from .views import StripeCheckoutAPIView, CreatePaymentIntentAPIView, CalculateShippingCostsView


urlpatterns = [
    path('calculate-shipping-costs', CalculateShippingCostsView.as_view(), name='calculate_shipping_costs'),
    path('create-payment-intent', CreatePaymentIntentAPIView.as_view(), name='stripe_payment_intent'),
    path('create-checkout-session', StripeCheckoutAPIView.as_view(), name='stripe_checkout_view'),
]
