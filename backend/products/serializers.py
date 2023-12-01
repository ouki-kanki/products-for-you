from rest_framework import serializers
from rest_framework.reverse import reverse
from user_control.models import CustomUser

from .models import Product, ProductItem, Category, Brand, Discount, ProductImage
from variations.serializers import VariationOptionsSerializer

import decimal


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


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image',)


# --- VARIATION OF THE PRODUCT --
class ProductItemSerializer(serializers.ModelSerializer):
    '''
    product_variation
    endpoint: products/product-items/
    # TODO: have to make another serializer for the detail
    & products/product-items/<sku>
    '''
    variation_option = VariationOptionsSerializer(many=True, read_only=True)
    discounts = serializers.SerializerMethodField()
    # variation_option = RelatedVariationsSerializer(many=True, read_only=True)
    discount_price = serializers.SerializerMethodField()
    # TODO: calculate the tota discounted price

    # images = ProductImageSerializer(many=True, read_only=True)


    def get_discount_price(self, obj):
        items = obj.discount.all()

        if items:
            total_discount_perc = sum([discount.discount_value for discount in items])

            normalized_total_discount_perc = total_discount_perc if total_discount_perc < 100 else 100

            return obj.price - (obj.price * (decimal.Decimal(normalized_total_discount_perc) / 100))
        return 'there is no discount'

    def get_discounts(self, obj):
        items = obj.discount.all()
        

        if items:
            return DiscountSerializer(items, many=True).data
        return 'no related discounts'


    # TODO: can also fetch the images here.is this the best practice performance wise ?

    class Meta:
        model = ProductItem
        fields = [
            'product_name',
            'sku',
            'quantity',
            'price',
            'variation_option',
            'discounts',
            'discount_price'
        ]

    # def get_name(self, obj):
    #     return obj.product_id.name

# v1 -- fetch product items . if the product has isFeatured - True fetch it otherwise fetch the last created . () 
# TODO: i want functionality where only one product can have featured = True
class FeaturedVariationSerializerV1(serializers.ModelSerializer):
    class Meta:
        model = ProductItem
        exclude = ('crated_at', 'modified_at')



# V2
# gives the product with the related variations and the images for each variation 
class ProductAndFeaturedVariationSerializer(serializers.ModelSerializer):
    variations = ProductItemSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    featured_variation = ProductItemSerializer(required=False, read_only=True)

    class Meta:
        model= Product
        exclude = ('created_at', 'modified_at')



class ProductSerializer(serializers.ModelSerializer):
    '''
    product-list
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
    '''
    endpoint: /products/<slug>
    '''
    related_variations = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ('name', 
                  'category', 
                  'brand', 
                  'related_variations',)


    def get_related_variations(self, obj):
        if obj.product_variations.all():
            items = obj.product_variations.all()

            return ProductItemSerializer(items, many=True).data
        
        return "no related variations"

    # --- V3 -----

class ProductImageSerializerV3(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image', 'featured')

    
class ProductVariationSerializerV3(serializers.ModelSerializer):
    product_image = ProductImageSerializer(many=True, read_only=True)
    # variation_option_name = serializers.StringRelatedField(source='variation_option', many=True)

    current_variation = serializers.SerializerMethodField()
    # discount = serializers.StringRelatedField(many=True)
    # variation_option to give the variation chars

    def get_current_variation(self, obj):
        variations = obj.variation_option.all()
        return VariationOptionsSerializer(variations, many=True).data
    class Meta:
        model = ProductItem
        fields = ('quantity', 'price', 'product_image', 'current_variation',)


class ProductAndLastCreatedVariationSerializerV3(serializers.ModelSerializer):
    '''
    this returns the last created variation for each product.it does not return the last created products.
    '''
    last_created = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('name', 'last_created')

    def get_last_created(self, obj):
        last_variation = obj.product_variations.order_by('-created_at').first()
        if last_variation:
            return ProductVariationSerializerV3(last_variation).data
        else: 
            return 'no variations for the product'


# TODO: how can i get the featured item in a not nested manner ? should i do it here inside the seriailizer or inside the view ? 
class ProductSerializerV3(serializers.ModelSerializer):
    # TODO: need only the featured var or the last imported
    featured_product = ProductVariationSerializerV3(source='product_variations', many=True, read_only=True)
    # TODO need to add the category reverse rel
    # TODO need to add the brand reverse rel
    # TODO where to put count to count the number of products ? here or inside views?

    class Meta:
        model = Product
        # fields = ('name', 'featured_variation')
        fields = ('name', 'featured_product')

    # def get_featured_variation(self, obj):
    #     featured_variation = obj.product_variations.filter(is_featured=True).first()
    #     return ProductVariationSerializerV3(featured_variation).data if featured_variation else None
    
    
    # def to_representation(self, instance):
    #     print(instance.featured_variation)
    #     data = super().to_representation(instance)
    #     if data['featured_variation']:
    #         return { 'name': data['name'], 'quantity': data['featured_variation']['quantity'] }
    #     return data

