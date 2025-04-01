from _decimal import Decimal

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, serializers
from rest_framework.response import Response

from payments.models import ShippingPlanOption
from products.models import ProductItem
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

    @staticmethod
    def create_order_items(cart):
        """
        prepare the order_items from the cart data
        """
        order_items = []
        order_item = {}
        if isinstance(cart, dict):
            for item in cart.get('items', []):
                uuid = item.get('uuid')
                product_item = get_object_or_404(ProductItem, uuid=uuid)

                order_item['product_item'] = product_item.id
                order_item['quantity'] = item.get('quantity')
                order_item['price'] = item.get('price')

                order_items.append(order_item)
        else:
            raise TypeError('cart has to be a dict')

        return order_items

    def create(self, request, *args, **kwargs):
        # TODO: fetch the cart from database or session and check again
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

            # TODO: clear the cart from the session

            self.unlock_cart(request, cart)

            payload = request.data
            user_details = payload.get("user_details")
            address = user_details.get("address")
            shipping_plan = ShippingPlanOption.objects.get(uuid=shipping_plan_id)

            # create the order_items list
            order_items = self.create_order_items(cart)

            clean_data = {
                "user_id": user_details.get("userId", "guest"),
                "order_item": order_items,
                "phoneNumber": user_details.get("phoneNumber"),
                "shipping_address": address.get("shippingAddress"),
                "billing_address": address.get("billingAddress"),
                "order_total": str(Decimal(total_amount) / 100),
                "stripe_payment_id": payment_intent_id,
                "shipping_plan": shipping_plan.id,
                "cart": cart if request.user.is_authenticated else None,
                "session_cart": None if request.user.is_authenticated else cart
            }

            print("the clean data", clean_data)

            serializer = self.get_serializer(data=clean_data)
            try:
                serializer.is_valid(raise_exception=True)
            except serializers.ValidationError as e:
                print("inside the exception", serializer.errors)
                return Response({
                    "message": 'cannot create order'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            self.perform_create(serializer)

            return Response({
                "message": 'your order was created, you will receive an email shortly after'
            }, status=status.HTTP_201_CREATED)

        except stripe.error.StripeError as e:
            self.unlock_cart(request, cart)
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            self.unlock_cart(request, cart)
            return generic_exception(e)

    def perform_create(self, serializer):
        # make the order_status = CREATED
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
