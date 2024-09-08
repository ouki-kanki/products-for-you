import factory
from datetime import datetime
from faker import Faker
from pytest_factoryboy import register
from products.models import Product, ProductItem, ProductImage

fake = Faker()


@register
class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = fake.lexify(text='product_name_????')
    created_at = factory.LazyFunction(datetime.now)
    updated_at = factory.LazyFunction(datetime.now)

    @factory.post_generation
    def brand(self, create, extracted, **kwargs):
        pass


@register
class ProductItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductItem

    slug = fake.lexify(text="item_slug_????")
    product = factory.SubFactory(ProductFactory)
    price = fake.pydecimal(positive=True, right_digits=2, max_value=2000)
    quantity = fake.pyint(min_value=0, max_value=250)
    detailed_description = fake.text()
    is_default = fake.pybool(truth_probability=70)


@register
class ProductImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductImage

    product_item = factory.SubFactory(ProductItemFactory)
    image = 'icons/placeholder.jpg'
    is_default = True
    has_thumbnail = True

