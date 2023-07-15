'''settins for dev env'''

import os
from .settings import *

ALLOWED_HOSTS += ['127.0.0.1', 'localhost']

INSTALLED_APPS += [
    'drf_spectacular',
    'drf_spectacular_sidecar'
]

DEBUG = True

WSGI_APPLICATION = 'e_shop.wsgi.dev.application'

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }


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
