from datetime import datetime
from django.db import transaction
from rest_framework import serializers

from .models import ShopOrder, ShopOrderitem, OrderStatus


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = ('status',)


class ShopOrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShopOrderitem
        fields = ('quantity', 'price', 'product_item')


class ShopOrderSerializer(serializers.ModelSerializer):
    # order_status = OrderStatusSerializer()
    order_item = ShopOrderItemSerializer(many=True)
    user_email = serializers.EmailField(write_only=True)
    stripe_payment_id = serializers.CharField(write_only=True)
    extra_shipping_details = serializers.CharField(write_only=True, allow_blank=True)
    session_cart = serializers.JSONField(write_only=True, allow_null=True)

    class Meta:
        model = ShopOrder
        fields = ('user_id',
                  'phoneNumber',
                  'shipping_address', 'billing_address',
                  'user_email', 'stripe_payment_id',
                  'extra_shipping_details',
                  'order_total', 'session_cart', 'cart',
                  'order_item')
        read_only_fields = (
            'created_at',
        )


    @staticmethod
    def get_item_instance_and_quantity(order_item_data):
        product_item_instance = order_item_data.get('product_item')
        quantity_from_cart = order_item_data.get('quantity')

        return product_item_instance, quantity_from_cart

    def create(self, validated_data):
        order_items = validated_data.pop('order_item', [])
        request = self.context.get('request')

        # order_total = sum(item['quantity'] * item['price'] for item in order_items_data)
        order_status_value = OrderStatus.objects.get(status='PLACED')
        validated_data['order_status'] = order_status_value

        for order_item in order_items:
            """
            check if the quantity is valid and subtrack the items
            """
            product_item_instance, quantity_from_cart = self.get_item_instance_and_quantity(order_item)

            if product_item_instance.quantity < quantity_from_cart:
                raise serializers.ValidationError({
                    'product_item': f'{product_item_instance.variation_name} is sold'
                })

        with transaction.atomic():
            order = ShopOrder.objects.create(**validated_data)

            for order_item in order_items:
                # json gives the id but django hydrates the result with the instance of the related product_item
                product_item_instance, quantity_from_cart = self.get_item_instance_and_quantity(order_item)

                product_item_instance.quantity -= quantity_from_cart
                product_item_instance.save()

                ShopOrderitem.objects.create(order=order, **order_item)

            return order

# SERIALIZE THE ORDERS FOR THE FRONT
# TODO have to dry (similar logic above)
class ProductItemForOrderSerializer(serializers.Serializer): # noqa
    sku = serializers.CharField(max_length=100)
    slug = serializers.SlugField()
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, obj): # noqa
        request = self.context.get('request')
        thumbs_qs = obj.product_image.filter(is_default=True)

        if thumbs_qs.exists() and request:
            thumb_url = thumbs_qs.first().thumbnail.url
            return request.build_absolute_uri(thumb_url)
        return None


class ShopOrderItemSerializerForClient(serializers.ModelSerializer):
    product_item = ProductItemForOrderSerializer()

    class Meta:
        model = ShopOrderitem
        fields = ('quantity', 'price', 'product_item')

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        # flatten the values
        product_item = ret.pop('product_item')
        for key, value in product_item.items():
            ret[key] = value
        return ret


class ShopOrderSerializerForClient(ShopOrderSerializer):
    """
    used to list the orders in the user profile ?
    TODO: check if the above is correct
    """
    order_item = ShopOrderItemSerializerForClient(many=True)
    order_status = serializers.SerializerMethodField()

    class Meta:
        model = ShopOrder
        fields = tuple(field for field in ShopOrderSerializer.Meta.fields
                       if field not in ('user_id', 'phoneNumber', 'updated_at',)) + ('order_status',)

    def get_order_status(self, obj): # noqa
        return obj.order_status.status

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        order_date = ret.get('created_at')

        if order_date:
            order_date = datetime.fromisoformat(order_date).strftime("%d-%m-%Y %H:%M:%S")
            ret['created_at'] = order_date
        return ret


