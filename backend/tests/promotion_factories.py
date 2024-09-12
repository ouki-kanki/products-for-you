import random
import string
from datetime import datetime, timedelta, date
import datetime

from faker import Faker
from faker.providers import DynamicProvider
import factory
from factory import fuzzy
from pytest_factoryboy import register
from promotion.models import Promotion, Coupon, PromoType


fake = Faker()


@register
class CouponFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Coupon

    name = factory.Faker('name')
    coupon_code = fuzzy.FuzzyText(length=10, chars=string.ascii_letters)


@register
class PromoTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PromoType

    name = factory.Faker('name')




@register
class PromotionFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Promotion

    name = factory.Faker('name')
    slug = factory.Faker('name')
    description = factory.Faker('catch_phrase')
    promo_reduction = factory.LazyAttribute(lambda x: random.randrange(0, 100 + 1))
    is_active = True
    is_scheduled = False
    promo_start = factory.LazyFunction(date.today)
    promo_end = factory.LazyFunction(lambda: date.today() + timedelta(days=20))

    coupon = factory.SubFactory(CouponFactory)
    promo_type = factory.SubFactory(PromoTypeFactory)

    @factory.post_generation
    def products_on_promotion(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        self.products_on_promotion.add(**extracted)

