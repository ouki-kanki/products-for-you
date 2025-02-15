from rest_framework import serializers
from promotion.models import PromoType, Coupon, Promotion, ProductsOnPromotion


class PromoTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoType
        fields = ('name', )


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('name', 'coupon_code')


class ProductItemsListSerializer(serializers.RelatedField): # noqa
    def to_representation(self, value):
        return {
            value.slug,
            value.variation_name,
            value.sku
        }


class ProductItemSerializer(serializers.Serializer): # noqa
    slug = serializers.CharField(read_only=True)
    variation_name = serializers.CharField(read_only=True)
    sku = serializers.CharField(read_only=True)


class PromotionSerializer(serializers.ModelSerializer):
    products_on_promotion = ProductItemSerializer(many=True, read_only=True)
    coupon = CouponSerializer(read_only=True)
    promo_type = PromoTypeSerializer(read_only=True)

    class Meta:
        model = Promotion
        fields = '__all__'


# is used on the productItems serializer products/serializers to fetch the promotions for each productItem
class ProductOnPromotionSerializer(serializers.ModelSerializer):
    promo_start = serializers.DateField(source='promotion_id.promo_start')
    promo_end = serializers.DateField(source='promotion_id.promo_end')
    promotion_name = serializers.CharField(source='promotion_id.name')
    is_active = serializers.BooleanField(source='promotion_id.is_active')
    is_scheduled =serializers.BooleanField(source='promotion_id.is_scheduled')
    promo_reduction = serializers.IntegerField(source='promotion_id.promo_reduction')

    class Meta:
        model = ProductsOnPromotion
        fields = ('promotion_name',
                  'promo_price',
                  'promo_start',
                  'promo_end',
                  'is_active',
                  'is_scheduled',
                  'promo_reduction')

