import os
import sys
from .settings import *
from decouple import config


ALLOWED_HOSTS += ['127.0.0.1', 'localhost']

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


CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://127.0.0.1:3000',
)

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
