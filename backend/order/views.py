from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from shopping_cart.models import Cart
from .models import ShopOrder
from .serializers import ShopOrderSerializer

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderCreateView(generics.CreateAPIView):
    queryset = ShopOrder.objects.all()
    serializer_class = ShopOrderSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # TODO: fetch the cart from database or session and check again

        data = request.data

        payment_intent_id = request.data.get('paymentIntentId')
        cart_from_checkout = request.data.get('cart')
        user = request.user

        if not user.is_authenticated:
            cart = request.session.get('cart', [])
        else:
            cart = get_object_or_404(Cart, user=user, status=Cart.Status.ACTIVE)
        if not cart:
            return Response({
                "message": 'cannot find cart'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not payment_intent_id:
            return Response({
                "message": "payment id was not provided"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

            if payment_intent.status != 'succeeded':
                return Response({
                    'message': 'payment was not successful'
                }, status=status.HTTP_400_BAD_REQUEST)

            # validate the cart from the user


            # TODO: clear the cart from the session

            return Response({
                "message": 'almost there'
            }, status=status.HTTP_400_BAD_REQUEST)

            return super().create(request, *args, **kwargs)
        except stripe.error.StripeError as e:
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


order_create_view = OrderCreateView.as_view()
