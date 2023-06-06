'''settins for dev env'''

import os
from .settings import *

ALLOWED_HOSTS += ['127.0.0.1', 'localhost']
DEBUG = True

WSGI_APPLICATION = 'e_shop.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://127.0.0.1:3000',
)
