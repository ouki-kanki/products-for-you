from django.db import transaction
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status

from .models import ShopOrder, ShopOrderitem, OrderStatus
from products.models import ProductItem

# class ProductItemSerializerForOrder(serializers.ModelSerializer):
#     class Meta:
#         model = ProductItem
#         fields = '__all__'


# # class ShopOrderItemSerializer(serializers.ModelSerializer):
# #     # product_item = ProductItemSerializerForOrder()
# #     class Meta:
# #         model = ShopOrderitem
# #         fields = ['id', 'quantity', 'price']

# class ShopOrderItemSerializer(serializers.Serializer):
#     product_id = serializers.IntegerField()
#     quantity = serializers.IntegerField()
#     price = serializers.DecimalField(max_digits=6, decimal_places=2)


# class ShopOrderSerializer(serializers.ModelSerializer):
#     # order_items = ShopOrderItemSerializer(many=True)
#     # phoneNumber = serializers.CharField(max_length=255)
#     # shipping_address = serializers.CharField(max_length=255)
#     # billing_address = serializers.CharField(max_length=255)
#     # order_total = serializers.DecimalField(max_digits=6, decimal_places=2)
#     # order_items = ShopOrderItemSerializer(many=True)

#     class Meta:
#         order_item = ShopOrderItemSerializer(many=True,)
#         model = ShopOrder
#         fields = ('phoneNumber', 'shipping_address', 'billing_address', 'order_status')
#         # extra_kwargs = {'order_status': {'required': False}}

#     def create(self, validated_data):
#         order_items_data = validated_data.pop('order_item', [])
#         order_total = sum(item['quantity'] * item['price'] for item in order_items_data)
#         order_status = OrderStatus.objects.get(status='PLACED')
#         validated_data['order_total'] = order_total
#         validated_data['order_status'] = order_status

#         order = ShopOrder.objects.create(**validated_data)

#         for order_item_data in order_items_data:
#             product_id = order_item_data.pop('product_id')
#             product_item = ProductItem.objects.get(pk=product_id)

#             ShopOrderitem.objects.create(order=order, product_item=product_item, **order_item_data)
            
#         return order


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = ('status',)


# NOTE this by default will hydrate the jsjon product_item field with the instance of the product item. if i want the id i can use the PrimaryKeyRelatedField 
class ShopOrderItemSerializer(serializers.ModelSerializer):
    # product_item = serializers.PrimaryKeyRelatedField()
    class Meta:
        model = ShopOrderitem
        fields = ('quantity', 'price', 'product_item')

# class ShopOrderItemSerializer(serializers.Serializer):
#     product_item = serializers.IntegerField()
#     quantity = serializers.IntegerField()
#     price = serializers.DecimalField(max_digits=6, decimal_places=2)


class ShopOrderSerializer(serializers.ModelSerializer):
    # order_status = OrderStatusSerializer()
    order_item = ShopOrderItemSerializer(many=True)

    class Meta:
        model = ShopOrder
        fields = ('user_id', 'order_date', 'modified', 'phoneNumber', 'shipping_address', 'billing_address', 'order_total', 'order_item')

    @staticmethod
    def get_item_instance_and_quantity(order_item_data):
        product_item_instance = order_item_data.get('product_item')
        quantity_from_cart = order_item_data.get('quantity')

        return product_item_instance, quantity_from_cart 
    

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_item', [])

        order_total = sum(item['quantity'] * item['price'] for item in order_items_data)
        order_status_value = OrderStatus.objects.get(status='PLACED')
        validated_data['order_status'] = order_status_value
        validated_data['order_total'] = order_total

        for order_item_data in order_items_data:
            product_item_instance, quantity_from_cart = self.get_item_instance_and_quantity(order_item_data)

            if product_item_instance.quantity < quantity_from_cart:
                raise serializers.ValidationError({
                    'product_item': f'{product_item_instance.variation_name} is sold'
                })
            
        with transaction.atomic():
            order = ShopOrder.objects.create(**validated_data)

            for order_item_data in order_items_data:
                # json gives the id but django hydrates the result with the instance of the related product_item
                product_item_instance, quantity_from_cart = self.get_item_instance_and_quantity(order_item_data)

                product_item_instance.quantity -= quantity_from_cart
                product_item_instance.save()

                ShopOrderitem.objects.create(order=order, **order_item_data)

            return order
