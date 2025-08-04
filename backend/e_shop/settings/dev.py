import os
import sys
from .settings import *
from decouple import config


ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '172.240.3.1', '192.168.100.27']
CORS_ALLOWED_ORIGINS = ["http://172.240.3.1"]
CSRF_TRUSTED_ORIGINS += ["http://172.240.3.1"]

SESSION_COOKIE_SECURE = False

DATABASES.update({
    'test': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_TEST_NAME'),
        'USER': config('DB_TEST_USER'),
        'PASSWORD': config('DB_TEST_PASSWORD'),
        'HOST': config('DB_TEST_HOST'),
        'PORT': config('DB_TEST_PORT')
    }
})

INSTALLED_APPS += [
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'silk',
    # 'django_nose'
]

DEBUG = True

WSGI_APPLICATION = 'e_shop.wsgi.dev.application'


print("the wsgi application", WSGI_APPLICATION)

REST_FRAMEWORK_DEV_SETTINGS = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# REST_FRAMEWORK.update(REST_FRAMEWORK_DEV_SETTINGS)

SPECTACULAR_SETTINGS = {
    'TTTLE': 'Products For You',
    'DESCRIPTION': "simple e-commerce application",
    'VERSION': '1.0.0',
    'SWAGGER_UI_DIST': 'SIDECAR',  # shorthand to use the sidecar instead
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
}

# FOR DEBUG TOOLBAR
INTERNAL_IPS = [
    '127.0.0.1',
]

# TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

# NOSE_ARGS = [
#     '--with-coverage',
#     '--cover-package=products'
# ]

DBBACKUP_DIR = BASE_DIR / 'db_backups'

#  VALKEY SETUP
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"


CACHES = {
    "default": {
        "BACKEND": "django_valkey.cache.ValkeyCache",
        "LOCATION": "valkey://localhost:6379/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_valkey.client.DefaultClient",
            "PASSWORD": config('VALKEY_PASSWORD')
        }
    },
    "session": {
        "BACKEND": "django_valkey.cache.ValkeyCache",
        "LOCATION": "valkey://localhost:6379/1",
        "OPTIONS": {
            "PASSWORD": config('VALKEY_PASSWORD')
        }
    }
}
