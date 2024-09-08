import pytest
from django.conf import settings


def test_settings_module():
    print("this is the settings module", settings.SETTINGS_MODULE)
    assert settings.SETTINGS_MODULE == 'e_shop.settings.dev'
