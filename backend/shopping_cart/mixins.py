from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from products.models import ProductItem
from promotion.models import ProductsOnPromotion
from .models import Cart
from common.util.santizers import strip_zero_decimals_from_str


class CartMixin:

    @staticmethod
    def sanitize_cart(cart):
        keys_to_omit = [
            'numberOfItems',
            'isUpdating',
            'isSynced',
            'locked'
        ]

        clean_cart = {
            key: value for key, value in cart.items()
            if key not in keys_to_omit
        }

        clean_cart['total'] = strip_zero_decimals_from_str(str(cart.get('total')))

        for item in cart['items']:
            item['price'] = strip_zero_decimals_from_str(str(item['price']))

        return clean_cart

    @staticmethod
    def get_cart(request):
        """
        returns the cart from db or the session
        """
        if request.user.is_authenticated:
            user = request.user
            cart = get_object_or_404(Cart, user=user, status=Cart.Status.ACTIVE)
        else:
            cart = request.session.get('cart', None)
        return cart

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
