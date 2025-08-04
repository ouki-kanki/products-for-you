from django.shortcuts import get_object_or_404
from django.utils.timezone import now

from products.models import ProductItem
from promotion.models import ProductsOnPromotion
from shopping_cart.serializers import CartSerializer

from common.exceptions.exceptions import generic_exception
from common.util.santizers import strip_zero_decimals_from_str

from .models import Cart


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
        sorted_items = sorted(items, key=lambda item: item.get('uuid'))

        # sort the items for the comparison between the client and server cart to work
        clean_cart['items'] = sorted_items
        clean_cart['total'] = strip_zero_decimals_from_str(str(cart.get('total')))

        for item in clean_cart['items']:
            item['price'] = strip_zero_decimals_from_str(str(item['price']))

        return clean_cart

    @staticmethod
    def get_cart_instance_id(request):
        if request.user.is_authenticated:
            cart = get_object_or_404(Cart, user=request.user, status=Cart.Status.ACTIVE)
            return cart.id

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

        products_on_promotion = ProductsOnPromotion.objects.filter(
            product_item_id__uuid=product_item_uuid
        ).select_related('promotion_id')

        active_prices = [
            link_item.promo_price
            for link_item in products_on_promotion
            if link_item.promotion_id.is_active
        ]

        return min(active_prices) if active_prices else price


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


class OrderMixin:

    @staticmethod
    def create_order_items(cart):
        """
        prepare the order_items
        """
        order_items = []
        if isinstance(cart, dict):
            for item in cart.get('items', []):
                order_item = {}
                uuid = item.get('uuid')
                product_item = get_object_or_404(ProductItem, uuid=uuid)

                order_item['product_item'] = product_item.id
                order_item['quantity'] = item.get('quantity')
                order_item['price'] = item.get('price')

                order_items.append(order_item)
        else:
            raise TypeError('cart has to be a dict')

        return order_items

