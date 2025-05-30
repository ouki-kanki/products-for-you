from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'


class CartItemGuestSerializer(serializers.Serializer): # noqa
    uuid = serializers.UUIDField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()



class CartGuestSerializer(serializers.Serializer): # noqa
    items = CartItemGuestSerializer(many=True)
    total = serializers.SerializerMethodField()

    def get_total(self, obj): # noqa
        return str(sum(item['price'] * item['quantity'] for item in obj['items']))


class CartItemForCartSerializer(CartItemSerializer):
    """
    used when the front fetches the cart
    """
    variation_name = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    product_icon = serializers.SerializerMethodField()
    url_path = serializers.SerializerMethodField()
    uuid = serializers.SerializerMethodField()

    def get_uuid(self, obj): # noqa
        return str(obj.product_item.uuid)

    def get_url_path(self, obj): # noqa
        return obj.product_item.build_url_path

    def get_product_icon(self, obj): # noqa
        request = self.context.get('request')
        image_instance = obj.product_item.product_image.filter(is_default=True)\
            .first()
        if image_instance and image_instance.thumbnail:
            thumb_url = image_instance.thumbnail.url
            return request.build_absolute_uri(thumb_url)
        else:
            return None

    def get_variation_name(self, obj): # noqa
        return obj.product_item.variation_name

    def get_slug(self, obj): # noqa
        return obj.product_item.slug

    class Meta(CartItemSerializer.Meta):
        fields = (
            'uuid',
            'variation_name',
            'quantity',
            'price',
            'slug',
            'product_icon',
            'url_path'
        )


class CartSerializer(serializers.ModelSerializer):
    items = CartItemForCartSerializer(source='cart_items', many=True)
    total = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if 'items' in self.fields and hasattr(self.fields['items'], 'context'):
            self.fields['items'].context.update(self.context)

    def get_total(self, obj): # noqa
        items = obj.cart_items.all()

        total = 0
        for item in items:
            total += item.price * item.quantity
        return total

    class Meta:
        model = Cart
        fields = ('items', 'total')
