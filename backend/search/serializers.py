from rest_framework import serializers


class NameSerializer(serializers.Serializer):
    input = serializers.ListField(read_only=True)
    weight = serializers.IntegerField(read_only=True)

class SearchProductItemSerializer(serializers.Serializer): # noqa
    thumb = serializers.SerializerMethodField()
    name = serializers.CharField(read_only=True)
    categories = serializers.ListField(read_only=True)
    description = serializers.CharField(read_only=True)
    name_suggest = NameSerializer(read_only=True)

    slug = serializers.CharField(read_only=True)
    sku = serializers.CharField(read_only=True)
    upc = serializers.CharField(read_only=True)
    price = serializers.DecimalField(read_only=True, max_digits=6, decimal_places=2)
    is_default = serializers.BooleanField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)

    def get_thumb(self, hit):
        request = self.context.get('request')
        return request.build_absolute_uri(hit.thumb) if hit.thumb else 'no image'
