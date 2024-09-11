import pytest
from django.conf import settings

pytest_plugins = [
    "tests.api_client",
    "tests.factories",
    'tests.product_fixtures',
    'tests.promotion_fixtures',
    'tests.test_settings',
]
