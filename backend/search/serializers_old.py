from rest_framework import serializers
from django_elasticsearch_dsl_drf.serializers import DocumentSerializer

from .documents.productitem_dsl_drf import ProductItemDocument


class SearchProductItemDocumentSerializer(DocumentSerializer):
    thumb = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        document = ProductItemDocument
        fields = [
            'categories',
            'detailed_description',
            'slug',
            'sku',
            'price',
            'is_default',
            'description',
            'is_available'
        ]

    def get_name(self, hit): # noqa
        for item in hit:
            print("the hit item", item)
        return hit.name

    def get_thumb(self, instance): # noqa
        print("the instance", instance)
        request = self.context.get("request")
        return request.build_absolute_uri(instance.thumb) if instance.thumb else 'no thumb'


class SearchProductThumbNailSerializer(serializers.Serializer): # noqa
    thumbnail = serializers.SerializerMethodField()
    # is_default = serializers.BooleanField()
    def get_thumbnail(self, obj): # noqa
        if not obj.is_default:
            return 'no default image'
        if not obj.thumbnail:
            return 'no image'
        request = self.context.get('request')
        return request.build_absolute_uri(obj.thumbnail) if request else 'no_image'


class SearchProductItemsSerializer(serializers.Serializer): # noqa
    name = serializers.SerializerMethodField()
    # name = serializers.CharField(read_only=True)
    categories = serializers.SerializerMethodField()
    # categories = serializers.ListField(read_only=True)
    product_image = SearchProductThumbNailSerializer(read_only=True, many=True)

    sku = serializers.CharField(read_only=True)
    slug = serializers.CharField(read_only=True)
    quantity = serializers.IntegerField(read_only=True)
    price = serializers.DecimalField(read_only=True, max_digits=6, decimal_places=2)
    detailed_description = serializers.CharField(read_only=True)
    is_default = serializers.BooleanField()

    class Meta:

        fields = (
            'sku',
            'slug',
            'quantity',
            'price',
            'detailed_description',
            'is_default',
            # 'product'
            # 'categories'
        )

    def get_name(self, obj): # noqa
        print("the obj", obj)
        return obj.product.name

    def get_categories(self, obj): # noqa
        if obj.categories:
            return list(obj.categories)
