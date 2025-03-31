from django.urls import path
from .views import LocationListview, CreatePaymentIntentAPIView, CalculateShippingCostsView

urlpatterns = [
    path('get-locations', LocationListview.as_view(), name='get_location_list'),
    path('calculate-shipping-costs', CalculateShippingCostsView.as_view(), name='calculate_shipping_costs'),
    path('create-payment-intent', CreatePaymentIntentAPIView.as_view(), name='stripe_payment_intent'),
]
