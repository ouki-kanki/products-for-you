'''Use this for production'''

from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['http://productsforyou.com', ]
WSGI_APPLICATION = 'e_shop.wsgi.prod.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'db_name',
        'USER': 'db_user',
        'PASSWORD': 'db_password',
        'HOST': 'localhost',
        'PORT': '',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

# VALKEY
# NOTE: needs the name of the service and not the name of the container
CACHES = {
    "default": {
        "BACKEND": "django_valkey.cache.ValkeyCache",
        "LOCATION": "valkey://valkey:6379/0",
        "OPTIONS": {
            "PASSWORD": config('VALKEY_PASSWORD')
        }
    },
    "session": {
        "BACKEND": "django_valkey.cache.ValkeyCache",
        "LOCATION": "valkey://valkey:6379/1",
        "OPTIONS": {
            "PASSWORD": config('VALKEY_PASSWORD')
        }
    }
}
