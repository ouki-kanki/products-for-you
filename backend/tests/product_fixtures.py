import pytest
from django.conf import settings
from e_shop.settings.dev import DATABASES as TESTDB
from django.core.files.uploadedfile import SimpleUploadedFile

from django.db import connections
from django.db.utils import OperationalError
from products.models import (
    Category, Product,
    ProductItem, ProductImage
)


@pytest.fixture
def single_parent_category(db):
    """ returns a category instance to be used as parent to the category"""
    return Category.objects.create(name='clothing')


@pytest.fixture
def single_category(db, single_parent_category):
    """ returns a category instance """
    return Category.objects.create(name='shoes', parent_category=single_parent_category)


@pytest.fixture
def single_product(db, single_category):
    product = Product.objects.create(
        name='banana',
        category=single_category
    )

    return {
        'product': product
    }


@pytest.fixture
def single_product_item(db, single_product):
    product_item = ProductItem.objects.create(
        product=single_product['product'],
        slug='air_jordan_blue',
        sku='4523423662',
        quantity=23,
        price="24.50",
        is_default=True,
    )

    product_image = ProductImage.objects.create(
        product_item=product_item,
        # image= SimpleUploadedFile('image.jpg', b'yo'),
        image='icons/placeholder.jpg',
        has_thumbnail=True
    )

    return {
        'product_item': product_item,
        'product_image': product_image
    }
