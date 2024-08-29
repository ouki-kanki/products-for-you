from django.conf import settings

from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl_drf.analyzers import edge_ngram_completion
from django_elasticsearch_dsl_drf.compat import KeywordField, StringField
from django_elasticsearch_dsl_drf.versions import LOOSE_ELASTICSEARCH_VERSION


from products.models import ProductItem, Product, ProductImage

__all__ = ('ProductItemDocument',)

from search.documents.analyzers import html_strip

INDEX = Index(settings.ELASTICSEARCH_INDEX_NAMES[__name__])

INDEX.settings(
    number_of_shards=1,
    number_of_replicas=1,
    blocks={'read_only_allow_delete': None}
)


@INDEX.doc_type
class ProductItemDocument(Document):

    id = fields.IntegerField()

    __name_fields = {
        'raw': KeywordField(),
        'suggest': fields.CompletionField(),
        'edge_ngram_completion': StringField(
            analyzer=edge_ngram_completion
        ),
        'mlt': StringField(analyzer='english')
    }

    __name_fields.update(
        {
            'suggest_context': fields.CompletionField(
                contexts=[
                    {
                        "name": "categories",
                        "type": "category",
                        "path": "product.category"
                    }
                ]
            )
        }
    )

    detailed_description = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': KeywordField(),
            'mlt': StringField(analyzer='english')
        }
    )

    name = fields.TextField()
    categories = fields.TextField(multi=True)
    slug = fields.TextField()
    price = fields.FloatField()
    sku = fields.TextField()
    upc = fields.TextField()
    is_default = fields.BooleanField()
    quantity = fields.IntegerField()

    class Django(object):

        model = ProductItem

    def prepare_name(self, instance): # noqa
        return instance.product.name

    def prepare_categories(self, instance): # noqa
        return instance.categories


@registry.register_document
class ProductItemDocumentOld(Document):

    product = fields.ObjectField(
        properties={
            "name": fields.TextField(),
            "description": fields.TextField(),
        }
    )

    product_image = fields.NestedField(properties={
        'thumbnail': fields.FileField(),
        'is_default': fields.BooleanField(),
    })

    categories = fields.KeywordField(multi=True)
    product_name = fields.TextField()

    class Index:
        name = "productitem"

    class Django:
        model = ProductItem

        fields = [
            'sku',
            'slug',
            'detailed_description',
            'is_default',
            'quantity',
            'price',
        ]
        related_models = [Product, ProductImage]

        def prepare_categories(self, instance): # noqa
            return instance.categories

        def prepate_product_name(self, instance): # noqa
            return instance.product_name


