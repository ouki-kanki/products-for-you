import factory
from datetime import datetime
from faker import Faker
from faker.providers import DynamicProvider
from pytest_factoryboy import register
from products.models import Product, ProductItem, ProductImage, Category
from variations.models import Variation, VariationOptions


variation_names = DynamicProvider(
    provider_name='variation_names',
    elements=["color", "size",]
)

fake = Faker()
fake.add_provider(variation_names)


@register
class VariationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Variation

    name = fake.variation_names()


@register
class VariationOptionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = VariationOptions

    variation_id = factory.SubFactory(VariationFactory)
    value = factory.Faker('name')


@register
class CategoryFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Category

    name = fake.lexify(text='category_name_????')


@register
class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = factory.Faker('name')
    created_at = factory.LazyFunction(datetime.now)
    modified_at = factory.LazyFunction(datetime.now)
    category = factory.SubFactory(CategoryFactory)
    is_featured = True

    @factory.post_generation
    def brand(self, create, extracted, **kwargs):
        pass


@register
class ProductItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductItem

    slug = factory.Faker('name')
    product = factory.SubFactory(ProductFactory)
    price = fake.pydecimal(positive=True, right_digits=2, max_value=2000)
    quantity = fake.pyint(min_value=0, max_value=250)
    detailed_description = fake.text()
    # is_default = fake.pybool(truth_probability=70)
    is_default = True

    @factory.post_generation
    def variation_option(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        # this will create the variation_values binding
        self.variation_option.add(*extracted)


@register
class ProductImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductImage

    product_item = factory.SubFactory(ProductItemFactory)
    image = 'icons/placeholder.jpg'
    is_default = True
    has_thumbnail = True



