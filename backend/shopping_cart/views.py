from pprint import pprint
from decimal import InvalidOperation
from datetime import timedelta

from django.db import transaction
from django.utils.timezone import now

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView

from .models import Cart, CartItem
from products.models import ProductItem
from .serializers import CartSerializer, CartItemSerializer, CartGuestSerializer
from .mixins import CartMixin

from common.exceptions import exceptions


class GetUserCartApiView(APIView):
    # TODO use prefetch and select related
    def get(self, request, *args, **kwargs): # noqa
        user = request.user

        if not user:
            return Response({
                'could not find user'
            }, status=status.HTTP_404_NOT_FOUND)
        try:
            cart = Cart.objects.get(user=user, status=Cart.Status.ACTIVE)
            serializer = CartSerializer(cart, context={"request": request})
            print("the data form serializer", serializer.data)
            return Response({
                "cart": serializer.data
            }, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({
                "message": 'could not retrieve cart'
            }, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print("the error", e)
            return Response({
                "message": "something went wrong",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartCreateView(APIView, CartMixin):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request): # noqa
        user = request.user
        items = request.data.get('items', [])

        # pprint(items)
        # TODO: handle when the user is guest

        if not items:
            return Response({
                'message': 'there no items to add'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart, created = Cart.objects.get_or_create(user=user, status=Cart.Status.ACTIVE)

            if not created:
                cart.status = Cart.Status.ABANDONED
                cart.save()

            cart = Cart.objects.create(user=user, status=Cart.Status.ACTIVE)

            # delete carts that abandoned from more than 30 days
            Cart.objects.filter(status=Cart.Status.ABANDONED, modified_at=now() - timedelta(days=30))

            for item in items:
                # NOTE: checks if the promotion is active and calculates the price
                price = self.return_price_or_promo_price(item)

                # get the id of the item
                uuid = item.get('uuid')
                product_item = ProductItem.objects.get(uuid=uuid)

                product_item_id = ProductItem.objects.filter(uuid=uuid).values_list('id', flat=True).first()

                serializer_data = {
                    "product_item": product_item_id,
                    "cart_id": cart.id,
                    "price": price,
                    "quantity": item.get('quantity')
                }

                serializer = CartItemSerializer(data=serializer_data)
                if serializer.is_valid():
                    product_item = serializer.validated_data['product_item']
                    quantity = serializer.validated_data['quantity']
                    price = serializer.validated_data['price']
                    cart_id = serializer.validated_data['cart_id']

                    # get_or_create prevents the duplicates
                    cart_item, cart_item_created = CartItem.objects.get_or_create(
                        cart_id=cart_id,
                        product_item=product_item,
                        quantity=quantity,
                        price=price
                    )

                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                "message": "cart created"
            }, status=status.HTTP_201_CREATED)
        except ProductItem.DoesNotExist:
            return Response({
                "message": 'product does not exist'
            }, status=status.HTTP_400_BAD_REQUEST)
        except InvalidOperation:
            return Response({
                "message": 'price is wrong format'
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return exceptions.generic_exception(e)


class CreateGuestCartView(APIView, CartMixin):

    def post(self, request): # noqa
        items = request.data.get('items', [])

        if len(items) == 0:
            return Response({
                'message': 'there no items in the cart',
            }, status=status.HTTP_404_NOT_FOUND)

        for item in items:
            # NOTE: validates the promo price
            price = self.return_price_or_promo_price(item)
            item['price'] = price

        try:
            serializer = CartGuestSerializer(data={"items": items})

            if serializer.is_valid():
                request.session['cart'] = serializer.data
                # request.session.modified = True

                return Response({
                    "message": 'cart added to session'
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return exceptions.generic_exception(e)


class GetSessionCartApiView(APIView):

    def get(self, request): # noqa
        try:
            cart = request.session.get('cart', [])

            if not cart:
                return Response({
                    "message": "cart is empty or does not exist"
                }, status=status.HTTP_404_NOT_FOUND)
            return Response({
                "message": "cart was received successfully",
                "cart": cart
            }, status=status.HTTP_200_OK)
        except Exception as e:
            exceptions.generic_exception(e)


class CartDeleteApiView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return Cart.objects.get(user=self.request.user)
        except Cart.DoesNotExist:
            return Response({
                "message": 'could not find cart'
            }, status=status.HTTP_404_NOT_FOUND)


