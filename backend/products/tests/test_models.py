from pytest import mark

pytestmark = mark.django_db


@pytestmark
class TestBrandModel:
    def test_brands__str__(self, brand_factory):
        x = brand_factory()
        assert str(x) == "test_brand"