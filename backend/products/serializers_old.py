import decimal
from django.utils.text import slugify
from rest_framework import serializers
from rest_framework.reverse import reverse
from user_control.models import CustomUser

from .models import Product, ProductItem, Category, Brand, Discount, ProductImage
from variations.serializers import VariationOptionsSerializer

from .utils import get_list_of_parent_categories


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
    my_parent_category = serializers.SerializerMethodField()
    # my_parent_category = serializers.CharField(read_only=True, source='parent_category.name')
    # sub_categories = SubCategorySerializer(many=True)

    def get_my_parent_category(self, obj):
        parent_category = obj.parent_category
        if parent_category:
            return parent_category.name
        return None

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon', 'children', 'my_parent_category')


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
        return "no related products"

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


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'


# --- VARIATION OF THE PRODUCT --
class ProductItemSerializer(serializers.ModelSerializer):
    '''
    product_variation
    endpoint: products/product-items/
    & products/product-items/<sku>
    '''
    variation_option = VariationOptionsSerializer(many=True, read_only=True)
    discounts = serializers.SerializerMethodField()
    # variation_option = RelatedVariationsSerializer(many=True, read_only=True)
    discount_price = serializers.SerializerMethodField()
    # TODO: calculate the tota discounted price

    # images = ProductImageSerializer(many=True, read_only=True)

    def get_slug(self, obj):
        category_slug = slugify(obj.product_id.category.name)
        product_slug = slugify(obj.slug)




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
            'discount_price',
            'slug'
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
    # images = ProductImageSerializerV3(many=True, read_only=True)
    featured_variation = ProductItemSerializer(required=False, read_only=True)

    class Meta:
        model= Product
        exclude = ('created_at', 'modified_at')


# OBSOLETE
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
    # variations = ProductItemSerializer(source='product_variations', many=True, )


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


    # --- V3 ---- #
class ProductSerializerForTest(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Product


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


class CategoryAndParentCategoriesSerializerV3(serializers.Serializer):
    '''
    fetches the parent categories recursivelly
    '''
    name = serializers.CharField(max_length=255)
    parent_category = serializers.SerializerMethodField()
    icon = serializers.ImageField(allow_null=True)


    def get_parent_category(self, obj):
        parent_category = obj.parent_category
        if parent_category:
            return CategoryAndParentCategoriesSerializerV3(parent_category).data
        return None


class ProductAndCategoriesSerializerV3(serializers.ModelSerializer):
    category = CategoryAndParentCategoriesSerializerV3(read_only=True)

    class Meta:
        model = Product
        fields = ('category', )

    def to_representation(self, instance):
        print("the instance", instance)
        ret = super().to_representation(instance)
        category = ret.get('category')
        if category:
            list_of_categories = get_list_of_parent_categories(category, [])
            ret['category'] = list_of_categories

        return ret


class ProductImageSerializerV4(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ( 'id', 'url', 'is_default')

    def get_image(self, instance):
        if not instance.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(instance.image.url)
        else:
            return None

    def to_representation(self, instance):
        return {
            'url': self.get_image(instance),
            'is_default': instance.is_default
        }


class ProductThumbNailSerializerV3(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'url', 'is_default')

    def get_thumbnail(self, instance):
        if not instance.thumbnail:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(instance.thumbnail.url)
        else:
            return None

    def to_representation(self, instance):
        return {
            'url': self.get_thumbnail(instance),
            'is_default': instance.is_default
        }


# --- USED TO GET LATEST PRODUCTS -- *** PRIME SER **
class ProductVariationSerializerV3(serializers.ModelSerializer):
    product_images = ProductThumbNailSerializerV3(many=True, read_only=True, source='product_image')
    current_variation = serializers.SerializerMethodField()
    # discount = serializers.StringRelatedField(many=True)
    name = serializers.SerializerMethodField()
    category = ProductAndCategoriesSerializerV3(source='product')
    description = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()


    def get_name(self, obj):
        return obj.product.name

    def get_description(self, obj):
        return obj.product.description

    def get_features(self, obj):
        return obj.product.features

    def get_current_variation(self, obj):
        variations = obj.variation_option.all()
        return VariationOptionsSerializer(variations, many=True).data

    def to_representation(self, instance):
        ret  = super().to_representation(instance)
        obj_of_categories = ret['category']
        list_of_categories = [category for category in obj_of_categories['category']]
        ret['category'] = list_of_categories

        return ret


    class Meta:
        model = ProductItem
        fields = (
            'name',
            'description',
            'quantity',
            'price',
            'features',
            'product_images',
            'current_variation',
            'category')


class ProductSerializerV3(serializers.ModelSerializer):
    featured_product = ProductVariationSerializerV3(source='product_variations', many=True, read_only=True)
    # TODO where to put count to count the number of products ? here or inside views?

    class Meta:
        model = Product
        fields = ('name', 'featured_product')


class ProductItemSerializerV4(serializers.ModelSerializer):
    variation_details = serializers.SerializerMethodField()
    constructed_url = serializers.SerializerMethodField()
    product_thumbnails = ProductThumbNailSerializerV3(many=True, read_only=True, source='product_image')

    def get_constructed_url(self, obj):
        category_slug = slugify(obj.product.category.name)
        product_slug = slugify(obj.product.name)
        # variation_slug = slugify(obj.slug)

        return f"{category_slug}/{product_slug}/"

    def get_variation_details(self, obj):
        variations = obj.variation_option.all()
        return VariationOptionsSerializer(variations, many=True).data

    class Meta:
        model = ProductItem
        fields = (
            # 'id',
            'quantity',
            'price',
            # 'variation_option',
            'product_thumbnails',
            'variation_details',
            'slug',
            'constructed_url'
        )


#  -- OBSOLETE --
class ReverseUrlAndThumbsVariationSerializer(serializers.ModelSerializer):
    """
    the related variations reverse urls and the featured thumbs
    """
    thumb = serializers.SerializerMethodField()

    # def get_url(self, obj):
    #     print("yoyoyo")
    #     return reverse('products:product-item-detail', kwargs={'pk': obj.pk})

    def get_thumb(self, obj):
        featured_thumb = obj.product_image.filter(is_default=True).first()
        return ProductThumbNailSerializerV3(featured_thumb).data
    class Meta:
        model = ProductItem
        fields = (
            # 'url',
            'thumb',
        )


class ProductSerializerV4(serializers.ModelSerializer):
    """
    gets the product and the related default variation
    """
    category = CategoryAndParentCategoriesSerializerV3(read_only=True)
    selected_variation = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()

    def get_variations(self, obj):
        request = self.context.get('request')
        # print("the request", request)
        variations = obj.product_variations.all()
        # TODO: check the time complexity here (use prefect related)
        return [
            {
                'slug': variation.slug,
                'product_url': request.build_absolute_uri(reverse('products:product-preview', args=[variation.slug])),
                'thumb': request.build_absolute_uri(variation.product_image.filter(is_default=True) \
                                                    .first().thumbnail.url) if variation.product_image.filter(is_default=True).exists() else None
            }
            for variation in variations
        ]

    def get_brand(self, obj):
        return obj.brand.name

    def get_selected_variation(self, obj):
        """
        return the featured variation, if there is none, return the last created
        """
        variation = obj.product_variations.filter(is_default=True).first()
        if not variation:
            variation = obj.product_variations.last()
        product_item_serializerV4 = ProductItemSerializerV4(variation, context=self.context)
        return product_item_serializerV4.data

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        category = ret['category']
        list_of_categories = get_list_of_parent_categories(category, [])
        ret['category'] = list_of_categories

        return ret
    class Meta:
        model = Product
        fields = (
            'name',
            'description',
            'features',
            'category', # implement this check above
            'brand',
            'icon',
            'selected_variation',
            'variations'
        )


class ProductItemDetailSerializerV4(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    product_thumbnails = ProductThumbNailSerializerV3(many=True, read_only=True, source='product_image')
    product_images = ProductImageSerializerV4(many=True, read_only=True, source='product_image')

    # noinspection PyMethodMayBeStatic
    def get_features(self, obj):
        return obj.product.features

    # noinspection PyMethodMayBeStatic
    def get_categories(self, obj):
        category = obj.product.category
        list_of_categories = get_list_of_parent_categories(category, [])
        return list_of_categories

    def get_name(self, obj):
        return obj.product.name

    def get_icon(self, obj):
        product = obj.product
        if product and product.icon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(product.icon.url)
        return None
    class Meta:
        model = ProductItem
        fields = (
            'id',
            'slug',
            'name',
            'variation_name',
            'sku',
            'quantity',
            'price',
            'detailed_description',
            'features',
            'icon',
            'categories',
            'product_thumbnails',
            'product_images'
        )
        # exclude = ('id', 'created_at', 'modified_at',)


class ProductItemSearchSerializerV4(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product_id.name')
    product_description = serializers.ReadOnlyField(source='product_id.description')
    # product_category = serializers.ReadOnlyField(source='product_id.category'
    # )
    categories = serializers.SerializerMethodField()

    def get_categories(self, obj):
        category = obj.product_id.category
        list_of_cateogories = get_list_of_parent_categories(category, [])
        return list_of_cateogories

    class Meta:
        model = ProductItem
        fields = (
            'id',
            'product_name',
            'product_description',
            'detailed_description',
            'categories'
            # 'product_category'
        )


# SERIALIZERS V2

class ProductSerializerV2(serializers.ModelSerializer):
    class Meta:
        fields = (
            'name',
            'features'
        )

class ProductItemSerializerV2(serializers.ModelSerializer):
    # product =
    class Meta:
        model = ProductItem
        fields = (
            'product'
            'sku',
            'quantity',
            'price'
        )
