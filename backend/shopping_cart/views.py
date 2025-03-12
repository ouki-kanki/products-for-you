from pprint import pprint
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils.timezone import now

from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView

from promotion.models import ProductsOnPromotion
from .models import Cart, CartItem
from products.models import ProductItem
from .serializers import CartSerializer, CartItemSerializer, CartItemGuestSerializer

from common.exceptions import exceptions

class CartMixin:
    def validate_items(self):
        pass

    @staticmethod
    def return_price_or_promo_price(cart_item):
        """
        check if the promotion is active for the item and return the price
        """
        product_item_id = cart_item.get('product_item')
        product_item = ProductItem.objects.get(id=product_item_id)
        price = product_item.price

        promotion = ProductsOnPromotion.objects.filter(
            product_item_id=product_item_id,
            promotion_id__is_active=True,
            promotion_id__promo_start__lte=now(),
            promotion_id__promo_end__gte=now()
        ).first()

        return promotion.promo_price if promotion else price


class GetUserCartApiView(APIView):
    # TODO use prefetch and select related
    def get(self, request, *args, **kwargs): # noqa
        user = request.user

        if not user:
            return Response({
                'could not find user'
            }, status=status.HTTP_404_NOT_FOUND)
        try:
            cart = Cart.objects.get(user=user)
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


class CartItemCreateView(APIView, CartMixin):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request): # noqa
        user = request.user
        items = request.data.get('items', [])

        pprint(items)
        # TODO: handle when the user is guest
        # if the user is not loogged in create a session

        if not items:
            return Response({
                'message': 'there no items to add'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart, created = Cart.objects.get_or_create(user=user)

            # clear the old items to sync with the front
            # TODO: think of a more efficient way to do this
            cart.cart_items.all().delete()

            for item in items:
                price = self.return_price_or_promo_price(item)

                serializer_data = {
                    "product_item": item.get('product_item'),
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

                    # TODO: check  if there is coupon and adjust the price

                    cart_item, cart_item_created = CartItem.objects.get_or_create(
                        cart_id=cart_id,
                        product_item=product_item,
                        quantity=quantity,
                        price=price
                    )

                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                "message": "cart updated"
            }, status=status.HTTP_200_OK)
        except ProductItem.DoesNotExist:
            return Response({
                "message": 'product does not exist'
            }, status=status.HTTP_400_BAD_REQUEST)

        except Cart.DoesNotExist:
            return Response({
                "message": 'cart does not exist'
            }, status=status.HTTP_400_BAD_REQUEST)

        except InvalidOperation:
            return Response({
                "message": 'price is wrong format'
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("the exception", e)
            return Response({
                'message': 'something went wrong'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateGuestCartView(APIView, CartMixin):

    def post(self, request): # noqa
        items = request.data.get('items', [])

        if len(items) == 0:
            return Response({
                'message': 'there no items in the cart',
            }, status=status.HTTP_404_NOT_FOUND)

        for item in items:
            price = self.return_price_or_promo_price(item)
            item['price'] = price

        try:
            serializer = CartItemGuestSerializer(data=items, many=True)

            if serializer.is_valid():

                print(serializer.data)
                # if 'cart' not in request.session:
                #     request.session['cart'] = []
                request.session['cart'] = serializer.data
                # request.session.modified = True

                return Response({
                    "message": 'cart added to session'
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return exceptions.generic_exception(e)


class GetSessionCartApiView(APIView):

    def get(self, request): # noqa
        print(request.COOKIES)
        session_id = request.COOKIES.get('sessionid')
        print(request.session)
        print(request.session.items())
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


