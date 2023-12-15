import factory
import datetime
from datetime import datetime
from pytest import fixture
from pytest_factoryboy import register

from products.models import Brand, Product


@register
class BrandFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Brand

    name = "test_brand"
    description = "this is a test brand"



class BrandFactorySeq(factory.django.DjangoModelFactory):
    class Meta:
        model = Brand
    

    name = factory.Sequence(lambda n: f'brand{n}')
    description = factory.Sequence(lambda n: f'this is {n} brand')
# register(BrandFactory)


@register
class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = factory.Faker('word')
    slug = factory.Faker('slug')
    description = factory.Faker('text')
    created_at = factory.LazyFunction(datetime.now)
    modified_at = factory.LazyFunction(datetime.now)
    is_featured_product = False
    

    @factory.post_generation
    def features(self, create, extracted, **kwargs):
        pass

    @factory.post_generation
    def category(self, create, extracted, **kwargs):
        pass

    @factory.post_generation
    def icon(self, create, extracted, **kwargs):
            pass

