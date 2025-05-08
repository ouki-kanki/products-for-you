from attr import field
from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl_drf.analyzers import edge_ngram_completion
from networkx import multi_source_dijkstra

from products.models import ProductItem, Product, ProductImage
from .analyzers import html_strip, variation_name_analyzer


@registry.register_document
class ProductItemDocument(Document):

    name_suggest = fields.Completion()
    slug_suggest = fields.CompletionField()
    category_suggest = fields.CompletionField()
    # variation_name_suggest = fields.CompletionField()
    variation_name_suggest = fields.TextField(
        analyzer=variation_name_analyzer
    )

    slug = fields.TextField(
        fields={
            'raw': fields.TextField(analyzer=html_strip),
            'suggest': fields.Completion()
        }
    )

    sku = fields.TextField()
    price = fields.ScaledFloatField(scaling_factor=100)
    upc = fields.TextField()
    is_default = fields.BooleanField()
    availability = fields.TextField()
    created_at = fields.DateField()

    # -- custom fields --
    name = fields.KeywordField(
        fields={
            'raw': fields.TextField(analyzer=edge_ngram_completion),
            'suggest': fields.CompletionField()
        }
    )

    brand = fields.KeywordField(
        fields={
            'raw': fields.TextField(analyzer=edge_ngram_completion),
            'suggest': fields.CompletionField()
        }
    )

    tags = fields.KeywordField(
        fields={
            'raw': fields.KeywordField(multi=True),
            'suggest': fields.CompletionField(multi=True)
        }
    )

    thumb = fields.TextField()
    image = fields.TextField()
    description = fields.TextField()

    categories = fields.KeywordField(
        fields={
            'raw': fields.KeywordField(multi=True),
            'suggest': fields.CompletionField(multi=True)
        },
        multi=True
    )

    class Index:
        name = 'productitem'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = ProductItem
        related_models = [Product, ProductImage]

    def get_instances_from_related(self, related_instance):  # noqa
        if isinstance(related_instance, ProductImage):
            return related_instance.product_item

        elif isinstance(related_instance, Product):
            return related_instance.product_variations.all()

    def prepare_categories(self, instance): # noqa
        return [instance.product.category.name] if instance.product.category else []

    def prepare_name(self, instance): # noqa
        return instance.product.name

    def prepare_brand(self, instance): # noqa
        return instance.product.brand.name

    def prepare_thumb(self, instance): # noqa
        qs = instance.product_image.filter(is_default=True)
        for item in qs:
            if item.thumbnail:
                return "".join(item.thumbnail.url)
            return ""

    def prepare_image(self, instance): # noqa
        qs = instance.product_image.filter(is_default=True)
        return "".join([item.image.url for item in qs] if qs else '')

    def prepare_description(self, instance): # noqa
        return instance.product.description

    def prepare_name_suggest(self, instance): # noqa
        return {
            "input": [instance.product.name],
            "weight": 10
        }

    def prepare_slug_suggest(self, instance):  # noqa
        return {
            "input": [instance.slug],
            "weight": 10
        }

    def prepare_category_suggest(self, instance):
        return {
            "input": [instance.product.category.name],
            "weight": 10
        }

    def prepare_variation_name_suggest(self, instance):
        return instance.variation_name

    def prepare_tags(self, instance):
        return [tag.name for tag in instance.tags.all()]\
                if instance.tags.exists() else []
