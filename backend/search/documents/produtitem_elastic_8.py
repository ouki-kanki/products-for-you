from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl import Document, Index, fields
from products.models import ProductItem, Product, ProductImage


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
            """ return list of categories [grandparent, parent, current] """
            return instance.categories

        def prepate_product_name(self, instance): # noqa
            return instance.product_name
