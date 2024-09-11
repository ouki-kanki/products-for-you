from rest_framework import serializers
from promotion.models import PromoType, Coupon, Promotion


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
