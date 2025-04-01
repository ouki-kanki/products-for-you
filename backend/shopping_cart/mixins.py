from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from products.models import ProductItem
from promotion.models import ProductsOnPromotion
from shopping_cart.serializers import CartSerializer
from .models import Cart

from common.exceptions.exceptions import generic_exception
from common.util.santizers import strip_zero_decimals_from_str



class CartMixin:

    @staticmethod
    def sanitize_cart(cart):
        keys_to_keep = [
            'items',
            'total'
        ]

        item_keys_to_keep = [
            'uuid',
            'price',
            'quantity'
        ]

        clean_cart = {
            key: value for key, value in cart.items()
            if key in keys_to_keep
        }

        clean_cart['items'] = [
            {key: value for key, value in item.items()
             if key in item_keys_to_keep} for item in clean_cart.get('items', [])
        ]

        items = clean_cart.get('items')

        for item in items:
            # need to convert uuid to string for the comparison
            for key, value in item.items():
                if key == 'uuid':
                    item[key] = str(value)

        clean_cart['total'] = strip_zero_decimals_from_str(str(cart.get('total')))

        for item in clean_cart['items']:
            item['price'] = strip_zero_decimals_from_str(str(item['price']))

        return clean_cart

    @staticmethod
    def get_cart(request):
        """
        returns the cart from db or the session as a dict
        """
        try:
            if request.user.is_authenticated:
                user = request.user
                cart = get_object_or_404(Cart, user=user, status=Cart.Status.ACTIVE)
                items = cart.cart_items.all()
                id = cart.id

                serializer = CartSerializer(cart, context={"request": request})

                return serializer.data
            else:
                cart = request.session.get('cart', None)
            return cart
        except Exception as e:
            return generic_exception(e)

    @staticmethod
    def return_price_or_promo_price(cart_item):
        """
        check if the promotion is active for the item and return the price
        """
        product_item_uuid = cart_item.get('uuid')
        product_item = ProductItem.objects.get(uuid=product_item_uuid)
        price = product_item.price

        promotion = ProductsOnPromotion.objects.filter(
            product_item_id__uuid=product_item_uuid,
            promotion_id__is_active=True,
            promotion_id__promo_start__lte=now(),
            promotion_id__promo_end__gte=now()
        ).first()

        return promotion.promo_price if promotion else price


class CartLockMixin:
    @staticmethod
    def cart_is_locked(cart):
        """
        check if the cart is locked. returns a boolean
        """
        if isinstance(cart, dict):
            return cart.get("locked", False)
        elif isinstance(cart, Cart) and hasattr(cart, 'locked'):
            return cart.locked
        else:
            raise TypeError("unknown cart type")

    @staticmethod
    def lock_cart(request, cart):
        """
        lock the cart for db or the session
        """
        if isinstance(cart, dict):
            cart['locked'] = True
            request.session['cart'] = cart
        elif isinstance(cart, Cart) and hasattr(cart, 'locked'):
            cart.locked = True
            cart.save()
        else:
            raise TypeError("unknown cart type")

    @staticmethod
    def unlock_cart(request, cart):
        """
        unlock the cart for db or the session
        """
        if isinstance(cart, dict):
            cart['locked'] = False
            request.session['cart'] = cart
        elif isinstance(cart, Cart) and hasattr(cart, 'locked'):
            cart.locked = False
            cart.save()
        else:
            raise TypeError('unknown cart type')
