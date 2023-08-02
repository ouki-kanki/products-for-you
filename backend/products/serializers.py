from rest_framework import serializers
from rest_framework.reverse import reverse
from user_control.models import CustomUser

from .models import Product, ProductItem, Category, Brand
from variations.serializers import VariationOptionsSerializer


#  ---- ** CATEGORY ** ----
# TODO: maybe this will be needed to other places also. change the name and move it to another folder
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
        fields = ('name', 'icon', 'children')

# TODO: show the related products for the category
class CategoryRelatedProducts(serializers.ModelSerializer):
    '''
    details of the category with related products
    '''
    related_products = serializers.SerializerMethodField()

    def get_related_products(self, obj):
        if obj.products.all():
            items = obj.products.all()
            return ProductSerializer(items, many=True).data    
        return "no related variations"

    class Meta:
        model = Category
        fields = ('name', 'related_products', )


class CategoryPublicSerializer(serializers.Serializer):
    category = serializers.CharField(read_only=True)


class BrandSerializer(serializers.ModelSerializer):
    '''
    brands
    endpoint: products/brands
    ''' 
    class Meta:
        model = Brand
        fields = '__all__'


# --** PRODUCT **--
class ProductPublicSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    related_products = serializers.SerializerMethodField(read_only=True)


    # not implemented
    def get_related_products(self, obj):
        print("the obj", obj)
        return []
    

# class RelatedVariationsSerializer(serializers.RelatedField):

#     def to_representation(self, value):
#         print("the data", value)
#         data = {
#             "name": value.name
#         }

#         return data


# --- VARIATION OF THE PRODUCT --
class ProductItemSerializer(serializers.ModelSerializer):
    '''
    product_variation
    endpoint: products/product-items/
    '''
    variation_option = VariationOptionsSerializer(many=True, read_only=True)
    # variation_option = RelatedVariationsSerializer(many=True, read_only=True)

    # TODO: if there is a discount show the discount price 
    # check if this has to be inside the models or here


    class Meta:
        model = ProductItem
        fields = [
            'product_name',
            'sku',
            'quantity',
            'price',
            'variation_option'
        ]

    # def get_name(self, obj):
    #     return obj.product_id.name



class ProductSerializer(serializers.ModelSerializer):
    '''
    product-list
    endpoint: products/
    '''
    category = CategoryPublicSerializer(read_only=True)
    # NOTE: will return the string represantation of the child
    #  the name has to be the name of the related_name on the table
    # product_variations = serializers.StringRelatedField(many=True)
    # NOTE: brand = BrandSerializer() -> will give a json with the fields that are defined in the BrandSerializer
    brand = serializers.StringRelatedField()

    # children = serializers.SerializerMethodField('_get_children')

    # NOTE: source needs the related name delcared on the child model
    # -- This will fetch all the related variations!! --

    # variations = ProductItemSerializer(source='product_variations', many=True, )

    # variations = GetFirstRelated()

    # NOTE: name has to be the related name for reverse lookup
    # if it is different it will not give any error but it will show nothing

    # gives a list of the related variations using the sku of each variation as slug so that the front can build the url for each item
    product_variations = serializers.SlugRelatedField(many=True, read_only=True, slug_field='slug')

    first_related = serializers.SerializerMethodField()
    product_link = serializers.SerializerMethodField()


    class Meta:
        model = Product
        fields = ('name', 'category', 'brand', 'slug', 'product_variations', 'first_related', 'product_link',)

    def get_product_link(self, obj):
        return obj.get_absolute_url

    def get_first_related(self, obj):
        # TODO: this validation is trash
        if obj.product_variations.all():
            item = obj.product_variations.first()
            return ProductItemSerializer(item).data
        
        return "no related variation"


    

class ProductAndRelatedVariationsSerializer(serializers.ModelSerializer):
    related_variations = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ('name', 'category', 'brand', 'related_variations',)


    def get_related_variations(self, obj):
        if obj.product_variations.all():
            items = obj.product_variations.all()
            print("the items", items)
            return ProductItemSerializer(items, many=True).data
        
        return "no related variations"

