from _decimal import Decimal

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response

from shopping_cart.models import Cart
from shopping_cart.mixins import CartMixin, CartLockMixin
from .models import ShopOrder
from .serializers import ShopOrderSerializer
from common.exceptions.exceptions import generic_exception

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderCreateView(generics.CreateAPIView, CartMixin, CartLockMixin):
    queryset = ShopOrder.objects.all()
    serializer_class = ShopOrderSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # TODO: fetch the cart from database or session and check again

        payment_intent_id = request.data.get('paymentId')
        shippingPlanId = request.data.get('shippingPlanId')
        cart_from_checkout = request.data.get('cart')
        cart = self.get_cart(request)

        if not cart:
            return Response({
                "message": 'cannot find cart'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not payment_intent_id:
            return Response({
                "message": "payment id was not provided"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.lock_cart(request, cart)
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

            if payment_intent.status != 'succeeded':
                self.unlock_cart(request, cart)
                return Response({
                    'message': 'payment was not successful'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                sanitized_client_cart = self.sanitize_cart(cart_from_checkout)
                sanitized_server_cart = self.sanitize_cart(cart)
            except (TypeError, ValueError) as e:
                self.unlock_cart(request, cart)
                return Response({
                    "message": "the cart has wrong values"
                }, status=status.HTTP_400_BAD_REQUEST)

            if sanitized_client_cart != sanitized_server_cart:
                return Response({
                    "message": 'there was an error in the cart'
                }, status=status.HTTP_400_BAD_REQUEST)

            # TODO: clear the cart from the session

            self.unlock_cart(request, cart)

            return Response({
                "message": 'almost there'
            }, status=status.HTTP_200_OK)

            return super().create(request, *args, **kwargs)
        except stripe.error.StripeError as e:
            self.unlock_cart(request, cart)
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            self.unlock_cart(request, cart)
            return generic_exception(e)

    def perform_create(self, serializer):
        order = serializer.save()
        request = self.request

        if request.user.is_authenticated:
            # only if on successful order creation mark the cart as completed
            cart = get_object_or_404(Cart, user=request.user, status=Cart.Status.ACTIVE)
            cart.status = cart.Status.ORDERED
        else:
            cart = request.session.get('cart', None)
            if cart:
                # only if the creation of order was success delete the cart of the session
                del request.session['cart']


order_create_view = OrderCreateView.as_view()
