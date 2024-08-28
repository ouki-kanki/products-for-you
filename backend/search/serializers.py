from rest_framework import serializers
from products.models import ProductItem, Product, Category
# from django_elasticsearch_dsl_drf.serializers import DocumentSerializer


class ProductSerializer(serializers.Serializer): # noqa

    name = serializers.CharField(read_only=True)


class SearchProductItemsSerializer(serializers.Serializer): # noqa
    product = ProductSerializer()
    categories = serializers.SerializerMethodField()

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
            'product'
            'categories'
        )

    def get_categories(self, obj): # noqa
        if obj.categories:
            return list(obj.categories)
