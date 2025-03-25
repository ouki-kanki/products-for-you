from django.utils.timezone import now
from products.models import ProductItem
from promotion.models import ProductsOnPromotion


class CartMixin:
    def validate_items(self):
        pass

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


