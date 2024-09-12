import pytest

from django.db import IntegrityError
from ..models import Coupon, PromoType, Promotion


@pytest.mark.test
def test_coupon_creation(db, coupon):
    new_coupon = coupon
    get_coupon = Coupon.objects.first()

    assert new_coupon.id == get_coupon.id


@pytest.mark.test
@pytest.mark.django_db
def test_single_promotion_type_creation(db, single_promotion_type):
    new_promotion_type = single_promotion_type
    get_promo_type = PromoType.objects.first()

    assert new_promotion_type.id == get_promo_type.id


# @pytest.mark.test
@pytest.mark.db_fixture
# @pytest.mark.django_db
def test_promotion_creation(promotion_fixture):
    promotion_fixt = promotion_fixture
    promotion = promotion_fixt['promotion']
    promoted_product = promotion_fixt['promoted_product']

    get_promotion = Promotion.objects.first()
    get_promoted_product = get_promotion.products_on_promotion.first()

    assert promotion.id == get_promotion.id
    assert promoted_product == get_promoted_product


# @pytest.mark.test
@pytest.mark.db_factory
def test_promotion_name_uniqueness_integrity(promotion):
    pass


# @pytest.mark.django_db
# @pytest.mark.test
@pytest.mark.db_factory
def test_coupon_creation(db, coupon_factory):
    new_coupon = coupon_factory.create(name='summer_sale')
    get_coupon = Coupon.objects.first()

    assert new_coupon.id == get_coupon.id


# @pytest.mark.test
@pytest.mark.db_factory
def test_promotion_creation(db, promotion_factory):
    new_promotion = promotion_factory.create(name="summer_sale")

    assert new_promotion.name == "summer_sale"


@pytest.mark.test
@pytest.mark.db_factory
def test_promotion_name_unique_integrity(db, promotion_factory):
    promotion_factory.create(name="summer_sale")

    with pytest.raises(IntegrityError):
        promotion_factory.create(name="summer_sale")
