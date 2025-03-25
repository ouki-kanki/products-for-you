from django.urls import path
from .views import CreatePaymentIntentAPIView, CalculateShippingCostsView

urlpatterns = [
    path('calculate-shipping-costs', CalculateShippingCostsView.as_view(), name='calculate_shipping_costs'),
    path('create-payment-intent', CreatePaymentIntentAPIView.as_view(), name='stripe_payment_intent'),
]
