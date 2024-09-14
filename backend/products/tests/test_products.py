import pytest
from products.models import Category, Product, ProductItem


@pytest.mark.test
@pytest.mark.db_fixture
def test_category_creation(single_category):
    category = single_category
    get_category = Category.objects.get(id=category.id)  # first will give the parent_cat

    assert category.id == get_category.id


@pytest.mark.test
@pytest.mark.db_fixture
def test_parent_category_creation(single_category):
    category = single_category
    parent_category = Category.objects.first()  # single_category will call single_parent_category.
    # the first obj will be the parent cat

    assert category.parent_category == parent_category


@pytest.mark.test
@pytest.mark.db_fixture
def test_product_creation(single_product):
    product = single_product['product']
    get_product = Product.objects.first()

    assert product.id == get_product.id

