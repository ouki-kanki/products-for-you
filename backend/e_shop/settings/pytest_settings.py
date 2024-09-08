from .dev import *


DATABASES = {
    # 'test': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # },
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_TEST_NAME'),
        'USER': config('DB_TEST_USER'),
        'PASSWORD': config('DB_TEST_PASSWORD'),
        'HOST': config('DB_TEST_HOST'),
        'PORT': config('DB_TEST_PORT')
        }
}
