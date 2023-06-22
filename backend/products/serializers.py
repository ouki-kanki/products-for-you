from rest_framework import serializers
from rest_framework.reverse import reverse
from user_control.models import CustomUser

from .models import Product, ProductItem, Category


class CategoryChildrenSerializer(serializers.Serializer):
    '''
    finds the subcategories recursively 
    '''
    def to_representation(self, instance):
        serializer = self.parent.parent.__class__(instance, context=self.context)
        return serializer.data

class CategorySerializer(serializers.ModelSerializer):
    children = CategoryChildrenSerializer(many=True)
    # parent_category = serializers.PrimaryKeyRelatedField(read_only=True)
    # sub_categories = SubCategorySerializer(many=True)
    class Meta:
        model = Category
        fields = ('name', 'children')


class CategoryPublicSerializer(serializers.Serializer):
    category = serializers.CharField(read_only=True)


class ProductSerializer(serializers.ModelSerializer):
    '''
    product-list
    endpoint: products/
    '''
    category = CategoryPublicSerializer(read_only=True)
    # NOTE: will return the string represantation of the child
    #  the name has to be the name of the related_name on the table
    product_variation = serializers.StringRelatedField(many=True)

    # TODO: needs implementation later on the product_detail 
    # product_variation = serializers.SlugRelatedField(
    #     many=True,
    #     read_only=True,
    #     slug_field='price'
    # )


    class Meta:
        model = Product
        fields = ('name', 'category', 'product_variation') 

class ProductPublicSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    related_products = serializers.SerializerMethodField(read_only=True)


    def get_related_products(self, obj):
        print("the obj", obj)
        return []
    


class ProductItemSerializer(serializers.ModelSerializer):
    '''
    product_variation
    endpoint: products/product-items/
    '''
    product_name = ProductPublicSerializer(source='product', read_only=True)
    # name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductItem
        fields = [
            'product_name',
            'sku',
            'quantity',
            'price'
        ]

    # def get_name(self, obj):
    #     return obj.product_id.name

    


