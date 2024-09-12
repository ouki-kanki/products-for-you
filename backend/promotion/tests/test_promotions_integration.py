import json
import pytest
from hypothesis import given, settings, strategies as st


# @pytest.mark.test
@pytest.mark.django_db
def test_single_promotion(promotion, api_client):
    promotion_instance = promotion
    promotion = promotion_instance['promotion']
    promoted_product = promotion_instance['promoted_product']

    endpoint = f'/api/products/promotions/{promotion.slug}'
    response = api_client().get(endpoint)

    expected_json = {
        "id": promotion.id,
        "promo_reduction": promotion.promo_reduction,
        "name": promotion.name,
        "slug": promotion.slug,
        "description": promotion.description,
        "is_active": promotion.is_active,
        "is_scheduled": promotion.is_scheduled,
        "promo_start": promotion.promo_start.strftime('%Y-%m-%d'),
        "promo_end": promotion.promo_end.strftime('%Y-%m-%d'),

        "coupon": {
            "name": promotion.coupon.name,
            "coupon_code": promotion.coupon.coupon_code
        },
        "promo_type": {
            "name": promotion.promo_type.name
        },
        "products_on_promotion": [
            {
                'slug': promoted_product.slug,
                'variation_name': promoted_product.variation_name,
                'sku': promoted_product.sku
            }
        ]
    }

    assert response.status_code == 200
    assert json.loads(response.content) == expected_json


# @given(st.text(min_size=8, max_size=20))
# def test_values():
#     pass
