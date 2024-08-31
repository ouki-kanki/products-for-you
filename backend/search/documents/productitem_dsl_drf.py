from django.conf import settings

from django_elasticsearch_dsl import Document, Index, fields

from django_elasticsearch_dsl_drf.analyzers import edge_ngram_completion
from django_elasticsearch_dsl_drf.compat import KeywordField, StringField
from django_elasticsearch_dsl_drf.versions import LOOSE_ELASTICSEARCH_VERSION


from products.models import ProductItem, Product, ProductImage

__all__ = ('ProductItemDocument', )

from django_elasticsearch_dsl_drf.analyzers import edge_ngram_completion
from search.documents.analyzers import html_strip


INDEX = Index(settings.ELASTICSEARCH_INDEX_NAMES[__name__])


INDEX.settings(
    number_of_shards=1,
    number_of_replicas=0,
    # blocks={'read_only_allow_delete': None}
)


@INDEX.doc_type
class ProductItemDocument(Document):

    id = fields.IntegerField()

    categories = StringField(
        analyzer=html_strip,
        fields={
            'raw': fields.TextField(multi=True),
            'suggest': fields.CompletionField(multi=True)
        },
        multi=True
    )
    __title_fields = {
        'raw': KeywordField(),
        'suggest': fields.CompletionField(),
        'edge_ngram_completion': StringField(
            analyzer=edge_ngram_completion
        ),
        'mlt': StringField(analyzer='english'),
    }

    __title_fields.update(
        {
            'suggest_context': fields.CompletionField(
                contexts=[
                    {
                        "name": "name",
                        "type": "category",
                        "path": "name.raw",
                    },
                    {
                        "name": "slug",
                        "type": "category",
                        "path": "slug.raw",
                    },
                    {
                        "name": "category",
                        "type": "category",
                        "path": "categories.raw",
                    },
                ]
            ),
        }
    )

    # categories = fields.TextField(multi=True)
    slug = StringField(
        analyzer=html_strip,
        # fields=__title_fields,
        fields={
            'raw': KeywordField(),
            # 'raw': StringField(analyzer='keyword'),
            'suggest': fields.CompletionField(),
            # 'edge_ngram_completion': StringField(
            #     analyzer=edge_ngram_completion
            # )
        }
    )
    price = fields.FloatField()
    sku = fields.TextField()
    quantity = fields.IntegerField()
    upc = fields.TextField()
    is_default = fields.BooleanField()
    is_available = fields.BooleanField()

    # custom fields
    name = StringField(
        analyzer=html_strip,
        fields={
            'raw': KeywordField(),
            'suggest': fields.CompletionField()
        }
    )
    thumb = fields.TextField()
    description = fields.TextField(
        analyzer=html_strip,
        fields={
            'raw': KeywordField(),
            'mlt': StringField(analyzer='english')
        }
    )

    class Django(object):

        model = ProductItem

    def prepare_name(self, instance): # noqa
        return instance.product.name

    def prepare_categories(self, instance): # noqa
        return instance.categories

    def prepare_thumb(self, instance): # noqa
        qs = instance.product_image.filter(is_default=True)
        return "".join([item.thumbnail.url for item in qs]) if qs else ''

    def prepare_description(self, instance): # noqa
        return instance.product.description




