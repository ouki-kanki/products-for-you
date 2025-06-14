from django.utils.text import slugify
from django.http import HttpRequest
from rest_framework import serializers
from rest_framework.reverse import reverse
from rest_framework.validators import UniqueTogetherValidator

from promotion.serializers import ProductOnPromotionSerializer
from variations.serializers import VariationOptionsSerializer
from .models import (
    Product, ProductItem, Category, ProductImage, FavoriteProductItem
)

from .utils import (
    get_list_of_parent_categories, representation_categories_to_list,
    add_favorite_product_to_ret
)

class CategoryAndParentCategoriesSerializer(serializers.Serializer):  # noqa
    '''
    fetches the parent categories recursively
    '''
    name = serializers.CharField(max_length=255)
    parent_category = serializers.SerializerMethodField()
    icon = serializers.ImageField(allow_null=True)

    # noinspection PyMethodMayBeStatic
    def get_parent_category(self, obj):
        parent_category = obj.parent_category
        if parent_category:
            return CategoryAndParentCategoriesSerializer(parent_category).data
        return None


class ProductSerializer(serializers.ModelSerializer):
    """
    gets the product and the related default variation
    """
    category = CategoryAndParentCategoriesSerializer(read_only=True)
    selected_variation = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()

    def get_variations(self, obj):
        request: HttpRequest = self.context.get('request')
        variations = obj.product_variations.all()
        placeholder_url = request.build_absolute_uri('media/icons/placeholder')
        # TODO: check the time complexity here (use prefetch related)
        return [
            {
                'slug': variation.slug,
                'product_url': request.build_absolute_uri(reverse('products:product-preview', args=[variation.slug])),
                'thumb': request.build_absolute_uri(default_image.thumbnail.url)
                if (default_image := variation.product_image.filter(is_default=True).first())
                and default_image.thumbnail
                else placeholder_url
            }
            for variation in variations
        ]

    def get_brand(self, obj):  # noqa
        return obj.brand.name

    def get_selected_variation(self, obj):
        """
        return the featured variation, if there is none, return the last created
        """
        default_variation = obj.product_variations.filter(is_default=True).first()
        if not default_variation:
            default_variation = obj.product_variations.last()
        product_item_serializer = ProductItemSerializer(default_variation, context=self.context)
        return product_item_serializer.data

    def to_representation(self, instance):
        repr_data = super().to_representation(instance)
        category = representation_categories_to_list(repr_data)
        return category

    class Meta:
        model = Product
        fields = (
            'name',
            'description',
            'features',
            'category',  # implement this check above
            'brand',
            'icon',
            'selected_variation',
            'variations'
        )


class ProductThumbNailSerializer(serializers.ModelSerializer):
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


# This is used on products serializer to fetch the details of the current variation
class ProductItemSerializer(serializers.ModelSerializer):
    variation_details = serializers.SerializerMethodField()
    constructed_url = serializers.SerializerMethodField()
    product_thumbnails = ProductThumbNailSerializer(many=True, read_only=True, source='product_image')
    promotions = ProductOnPromotionSerializer(many=True, read_only=True, source='product_inventory')

    # noinspection PyMethodMayBeStatic
    def get_constructed_url(self, obj):
        return obj.build_url_path

    # noinspection PyMethodMayBeStatic
    def get_variation_details(self, obj):
        variations = obj.variation_option.all()
        return VariationOptionsSerializer(variations, many=True).data

    class Meta:
        model = ProductItem
        fields = (
            'quantity',
            'price',
            # 'variation_option',
            'product_thumbnails',
            'variation_details',
            'slug',
            'constructed_url',
            'promotions'
        )


# used to fetch the productvariations
class ProductItemExtendedSerializer(ProductItemSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj): # noqa
        return obj.product.name

    class Meta(ProductItemSerializer.Meta):
        fields = ProductItemSerializer.Meta.fields + ('name',)


class ProductItemQuantitySerializer(serializers.ModelSerializer):
    """
    used for the cart to validate the quantities of the products.
    """
    class Meta:
        model = ProductItem
        fields = ('uuid', 'quantity')


class ProductAndCategoriesSerializer(serializers.ModelSerializer):
    category = CategoryAndParentCategoriesSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ('category', )

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        category = ret.get('category')
        if category:
            list_of_categories = get_list_of_parent_categories(category, [])
            ret['category'] = list_of_categories

        return ret


class ProductVariationSerializer(serializers.ModelSerializer):
    product_images = ProductThumbNailSerializer(many=True, read_only=True, source='product_image')
    current_variation = serializers.SerializerMethodField()
    # discount = serializers.StringRelatedField(many=True)
    name = serializers.SerializerMethodField()
    category = ProductAndCategoriesSerializer(source='product')
    description = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    promotions = ProductOnPromotionSerializer(many=True, read_only=True, source='product_inventory')
    featured_position = serializers.SerializerMethodField()
    constructed_url = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()

    def get_variations(self, obj):
        request = self.context.get('request')
        variations = obj.product.product_variations.all()

        if variations.exists():
            # TODO: dry the same logic on productSerializer
            return [
                {
                    'slug': variation.slug,
                    'product_url': request.build_absolute_uri(reverse('api:product-preview', args=[variation.slug])),
                    'thumb': request.build_absolute_uri(variation.product_image.filter(is_default=True)
                                                        .first().thumbnail.url
                                                        ) if variation.product_image.filter(is_default=True).exists()
                    else None
                }
                for variation in variations
            ]
        else:
            return None

    # TODO: the same on productItemSerializer.dry
    def get_constructed_url(self, obj): # noqa
        category_slug = slugify(obj.product.category.name)
        product_slug = slugify(obj.product.name)
        # variation_slug = slugify(obj.slug)

        return f"{category_slug}/{product_slug}/"

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return
        print("the request inside the serializer", request)
        return True

    def get_featured_position(self, obj): # noqa
        featured_item = getattr(obj.product, 'featured_item', None)
        return featured_item.position if featured_item else None

    def get_name(self, obj): # noqa
        return obj.product.name

    def get_description(self, obj): # noqa
        return obj.product.description

    def get_features(self, obj): # noqa
        return obj.product.features

    def get_current_variation(self, obj): # noqa
        variations = obj.variation_option.all()
        return VariationOptionsSerializer(variations, many=True).data

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        obj_of_categories = ret['category']
        list_of_categories = [category for category in obj_of_categories['category']]
        ret['category'] = list_of_categories
        request = self.context.get('request')
        # user = request.user

        ret = add_favorite_product_to_ret(ret, request, instance)

        # if request and request.user.is_authenticated:
        #     is_favorite = FavoriteProductItem.objects.filter(user=request.user, product_item=instance).exists()
        #     ret['is_favorite'] = is_favorite
        return ret

    class Meta:
        model = ProductItem
        fields = (
            'name',
            'slug',
            'description',
            'availability',
            'price',
            'features',
            'product_images',
            'current_variation',
            'category',
            'promotions',
            'featured_position',
            'constructed_url',
            'variations'
            # 'is_favorite'
        )


class ProductImageSerializer(serializers.ModelSerializer):

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


class ProductItemDetailSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    other_variations_slugs = serializers.SerializerMethodField()
    product_thumbnails = ProductThumbNailSerializer(many=True, read_only=True, source='product_image')
    product_images = ProductImageSerializer(many=True, read_only=True, source='product_image')
    promotions = ProductOnPromotionSerializer(many=True, read_only=True, source='product_inventory')

    # noinspection PyMethodMayBeStatic
    def get_features(self, obj):
        return obj.product.features

    def get_other_variations_slugs(self, obj): # noqa
        """
        this is used to change variation inside the product detail
        """
        slugs_and_thumbs = []
        request = self.context.get('request')

        other_variations = [variation for variation in obj.product.product_variations.all()
                            if variation.slug != obj.slug]

        if not other_variations:
            return []

        for variation in other_variations:
            slug = variation.slug
            default_thumb_qs = variation.product_image.filter(is_default=True)

            if default_thumb_qs.exists():
                thumb_url = request.build_absolute_uri(default_thumb_qs[0].thumbnail.url)
            else:
                thumb_url = request.build_absolute_uri('/media/icons/placeholder.jpg')
            slugs_and_thumbs.append({'slug': slug, 'thumb_url': thumb_url})

        return slugs_and_thumbs

    # noinspection PyMethodMayBeStatic
    def get_categories(self, obj):
        category = obj.product.category
        list_of_categories = get_list_of_parent_categories(category, [])
        return list_of_categories

    def get_name(self, obj): # noqa
        return obj.product.name

    def get_icon(self, obj):
        product = obj.product
        if product and product.icon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(product.icon.url)
        return None

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')

        ret = add_favorite_product_to_ret(ret, request, instance)

        return ret

    class Meta:
        model = ProductItem
        fields = (
            'uuid',
            'slug',
            'name',
            'other_variations_slugs',
            'variation_name',
            'sku',
            'quantity',
            'availability',
            'price',
            'detailed_description',
            'features',
            'icon',
            'categories',
            'product_thumbnails',
            'product_images',
            'promotions'
        )


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

    def get_my_parent_category(self, obj): # noqa
        parent_category = obj.parent_category
        if parent_category:
            return parent_category.name
        return None

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon', 'children', 'my_parent_category')


class FavoriteProductItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteProductItem
        fields = '__all__'

        validators = [
            UniqueTogetherValidator,
        ]






