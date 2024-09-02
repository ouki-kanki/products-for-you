from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl import Document, Index, fields
from products.models import ProductItem, Product, ProductImage
from .analyzers import html_strip
from django_elasticsearch_dsl_drf.analyzers import edge_ngram_completion


@registry.register_document
class ProductItemDocument(Document):

    name_suggest = fields.Completion()
    slug_suggest = fields.CompletionField()

    slug = fields.TextField(
        fields={
            'raw': fields.TextField(analyzer=html_strip),
            'suggest': fields.Completion()
        }
    )

    sku = fields.TextField()
    price = fields.FloatField()
    upc = fields.TextField()
    is_default = fields.BooleanField()
    availability = fields.TextField()

    # -- custom fields --
    name = fields.TextField(
        fields={
            'raw': fields.TextField(analyzer=edge_ngram_completion),
            'suggest': fields.CompletionField()
        }
    )

    thumb = fields.TextField()
    image = fields.TextField()
    description = fields.TextField()

    categories = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(multi=True),
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

        if isinstance(related_instance, Product):
            return related_instance.product_variations.all()

    def prepare_name(self, instance): # noqa
        return instance.product.name

    def prepare_thumb(self, instance): # noqa
        qs = instance.product_image.filter(is_default=True)
        return "".join([item.thumbnail.url for item in qs]) if qs else ''

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
