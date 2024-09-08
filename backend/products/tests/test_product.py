import json
from unicodedata import decimal

import pytest
from django.conf import settings
import socket
import os

@pytest.mark.test
def test_get_featured_products():
    pass


@pytest.mark.test
def test_get_product_detail(single_product_item, api_client):
    product_item = single_product_item['product_item']
    product_image_instance = single_product_item['product_image']

    endpoint = f'/api/products/product-detail/{product_item.slug}/'
    response = api_client().get(endpoint)
    host = 'http://testserver'

    expected_json = {
        'id': product_item.id,
        'slug': product_item.slug,
        'name': product_item.product.name,
        'variation_name': product_item.variation_name,
        'sku': product_item.sku,
        'quantity': product_item.quantity,
        'price': product_item.price,
        'detailed_description': product_item.detailed_description,
        'features': product_item.product.features,
        'icon': f'{host}{product_item.product.icon.url}',
        'categories': product_item.categories,
        'product_thumbnails': [
            {
                "url": f'{host}{product_image_instance.thumbnail.url}',
                "is_default": product_image_instance.is_default
            }
        ],
        'product_images': [
            {
                "url": f'{host}{product_image_instance.image.url}',
                "is_default": product_image_instance.is_default
            }
        ]
    }

    assert response.status_code == 200
    assert json.loads(response.content) == expected_json




