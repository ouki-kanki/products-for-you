from datetime import date, timedelta
from datetime import datetime
import pytest
from promotion.models import PromoType, Promotion, Coupon, ProductsOnPromotion


@pytest.fixture
def single_promotion_type(db):
    promotion_type = PromoType.objects.create(name="summer sales")
    return promotion_type


@pytest.fixture
def coupon(db):
    coupon = Coupon.objects.create(name="summer_coupon", coupon_code="123456789")
    return coupon


@pytest.fixture
def promotion_fixture(db, single_product_item, coupon, single_promotion_type):
    promotion = Promotion.objects.create(
        name="summer promotion",
        slug="summer_promotion",
        promo_reduction=30,
        is_active=False,
        is_scheduled=True,
        promo_type=single_promotion_type,
        coupon=coupon,
        promo_start=date.today(),
        promo_end=date.today() + timedelta(30)
    )

    product_item = single_product_item['product_item']
    promotion.products_on_promotion.add(product_item,
                                        through_defaults={"promo_price": "100.00"})

    return {
        "promotion": promotion,
        "promoted_product": product_item
    }
