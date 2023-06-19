from rest_framework import serializers
from rest_framework.reverse import reverse
from user_control.models import CustomUser

from .models import Product, ProductItem, Category


# class ProductSerializer(serializers.ModelSerializer):
#     class meta:
#         model = Product


# TODO: this have to be a join of the product and productitem serializer
class ProductItemSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductItem
        fields = [
            'name',
            'sku',
            'quantity',
            'price'
        ]


    # TODO: this is not efficient!!!!
    def get_name(self, obj):
        return obj.product_id.name

    