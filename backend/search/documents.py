from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from products.models import ProductItem


@registry.register_document
class ProductItemDocument(Document):

    product_id = fields.ObjectField(
        properties={
            "name": fields.TextField(),
            "description": fields.TextField()
        }
    )

    class Index:
        name = "productitem"

    class Django:
        model = ProductItem

        fields = [
            'id',
            'sku',
            'slug',
            'detailed_description'
        ]
