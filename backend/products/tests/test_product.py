import json
import time
from collections import OrderedDict
from pprint import pprint
from unicodedata import decimal

import pytest
from django.conf import settings
import socket
import os


# @pytest.mark.test
# @pytest.mark.flaky(reruns=5, reruns_delay=3)
@pytest.mark.django_db
def test_get_featured_products(api_client, product_item_factory, variation_option_factory):
    num_of_products = 5
    num_of_variations = 2

    variation_option = variation_option_factory.create_batch(num_of_variations)
    product_items = product_item_factory.create_batch(num_of_products, variation_option=variation_option)

    endpoint = '/api/products/featured/'
    response = api_client().get(endpoint)

    products_list = []

    for product_item in product_items:
        expected_product_dict = {
            "name": product_item.product.name,
            "description": product_item.product.description,
            "quantity": product_item.quantity,
            "price": product_item.price,
            "features": product_item.product.features,
            "product_images": product_item.product_image.all(),
            "current_variation": product_item.variation_option.all(),
            "category": product_item.product.category
        }
        products_list.append(expected_product_dict)

    # TODO have to work a difference approach. items from response have inner orderDicts.
    ordered_products_list = [OrderedDict(item) for item in products_list]
    # sorted_product_list = sorted(ordered_products_list, key=lambda x: sorted(x.items()))
    # sorted_response_dict = sorted(response.data.get('results'), key=lambda x: sorted(x.items()))

    # TODO: compare results
    assert response.status_code == 200
    assert len(response.data.get('results')) == num_of_products
    # assert sorted_response_dict == sorted_product_list

    time.sleep(2)


# @pytest.mark.test
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




