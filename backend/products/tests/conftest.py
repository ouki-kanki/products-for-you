import pytest
from pytest_factoryboy import register
from .factories import BrandFactory, ProductFactory


register(BrandFactory)
register(ProductFactory)

# @pytest.fixture
# def brand_factory():
#     return BrandFactory()



