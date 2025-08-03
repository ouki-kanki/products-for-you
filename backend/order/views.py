from decimal import Decimal

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from payments.models import ShippingPlanOption
from shopping_cart.models import Cart
from shopping_cart.mixins import CartMixin, CartLockMixin, OrderMixin
from user_control.models import CustomUser
from .serializers import ShopOrderSerializer
from common.exceptions.exceptions import generic_exception
from common.services import email_service

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderCreateView(APIView, CartMixin, CartLockMixin, OrderMixin):

    def post(self, request):
        payment_intent_id = request.data.get('payment_id')
        shipping_plan_id = request.data.get('shipping_plan_id')
        cart_from_checkout = request.data.get('cart')
        cart = self.get_cart(request)
        # order_items = self.create_order_items(cart)

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
            total_amount = payment_intent.amount

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

            payload = request.data
            user_details = payload.get("user_details")
            address = user_details.get("address")
            user_email = user_details.get("email")
            shipping_plan = ShippingPlanOption.objects.get(uuid=shipping_plan_id)

            order_items = self.create_order_items(cart)
            cart_instance_id = self.get_cart_instance_id(request)
            # TODO: user_details have to have the field userId changed to uuid to be more clear
            uuid = user_details.get("userId")
            try:
                user_id = CustomUser.objects.get(uuid=uuid).id
            except CustomUser.DoesNotExist:
                user_id = "guest"

            clean_data = {
                "user_id": user_id,
                "order_item": order_items,
                "phoneNumber": user_details.get("phoneNumber"),
                "user_email": user_email,
                "shipping_address": address.get("shippingAddress"),
                "billing_address": address.get("billingAddress"),
                "extra_shipping_details": user_details.get("extraShippingDetails"),
                "order_total": str(Decimal(total_amount) / 100),
                "stripe_payment_id": payment_intent_id,
                "shipping_plan": shipping_plan.id,
                "cart": cart_instance_id if request.user.is_authenticated else None,
                # "cart": sanitized_server_cart if request.user.is_authenticated else None,
                "session_cart": None if request.user.is_authenticated else cart
                }

            serializer = ShopOrderSerializer(data=clean_data)
            try:
                serializer.is_valid(raise_exception=True)
                serializer.save()

                if request.user.is_authenticated:
                    session_cart = request.session.get('cart')
                    if session_cart:
                        del request.session['cart']
                        request.session.modified = True
                    cart = get_object_or_404(Cart, user=request.user, status=Cart.Status.ACTIVE)
                    self.unlock_cart(request, cart)

                    cart.status = cart.Status.ORDERED
                    cart.save()
                else:
                    cart = request.session.get('cart', None)
                    if cart:
                        del request.session['cart']

                order = serializer.instance

                email_service.send_order_completion_email(request, user_email)

                return Response({
                    "message": 'thank you for shopping from us.we will send you the comfirmation email shortafter',
                    "order_total": str(order.order_total)
                }, status=status.HTTP_201_CREATED)
            except serializers.ValidationError as e:
                print("validation order error", e)
                return Response({
                    "message": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except stripe.error.StripeError as e:
            self.unlock_cart(request, cart)
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            self.unlock_cart(request, cart)
            return generic_exception(e)


order_create_view = OrderCreateView.as_view()
