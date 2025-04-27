from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl import Document, fields
from products.models import Category


@registry.register_document
class CategoryDocument(Document):
    name_suggest = fields.CompletionField()

    class Index:
        name = 'category'
        settings = {
            'number_of_shards': 1,
            "number_of_replicas": 0
        }

    class Django:
        model = Category

    def prepare_name_suggest(self, instance):
        return {
            "input": [instance.name],
            "weight": 10
        }


