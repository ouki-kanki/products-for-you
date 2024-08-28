from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl_drf.compat import KeywordField, StringField

from products.models import ProductItem

from .analyzers import html_strip


@registry.register_document
class ProductItemDocument(Document):

    product = fields.ObjectField(
        properties={
            "name": fields.TextField(),
            "description": fields.TextField(),
        }
    )

    # categories = fields.TextField()
    categories = fields.KeywordField(multi=True)

    # categories = fields.ListField(
    #     StringField(
    #         analyzer=html_strip,
    #         fields={
    #             'raw': KeywordField(),
    #         }
    #     )
    # )

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
            # 'get_categories',
            # 'categories'
        ]

        def prepare_categories(self, instance): # noqa
            # print(instance.categories)
            return instance.categories
