import os
from datetime import timedelta
from pathlib import Path
from decouple import config
from urllib.parse import quote_plus as urlquote

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR project_root/e-shop
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG")

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'user_control.apps.UserControlConfig',
    'products.apps.ProductsConfig',
    'shopping_cart.apps.ShoppingCartConfig',
    'order.apps.OrderConfig',
    'variations.apps.VariationsConfig',
    'promotion',


    # third party apps
    'corsheaders',
    'channels',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    # 'rest_framework.authtoken',
    'django_elasticsearch_dsl_drf',
    'django_elasticsearch_dsl',
    'import_export'
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "silk.middleware.SilkyMiddleware",
]

ROOT_URLCONF = 'e_shop.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR.parent / 'templates'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'e_shop.wsgi.application'
ASGI_APPLICATION = 'e_shop.asgi.application'

# --- *** --- CHANNELS CONFIG --- *** ---

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }

}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT')
    }
}

# --- *** --- CORS & CSRF CONFIG --- *** ---

# CSRF_TRUSTED_ORIGINS = ['http://localhost:5173', ]
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = ["http://localhost:5173", 'http://127.0.0.1:5173', ]
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTP_ONLY = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
# CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken", 'X-Requested-With']
SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SAMESITE = None
# SESSION_COOKIE_SAMESITE: None


# *** --- PASSWORDS ---- ***

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]

# Internationalization
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Istanbul'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# NOTE: points inside e_shop directory
# STATICFILES_DIRS = (
#     os.path.join(BASE_DIR, 'static'),
# )


# User uploaded files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# AUTHENTICATION

AUTH_USER_MODEL = "user_control.CustomUser"
ACCOUNT_AUTHENTICATION_METHOD = 'email'


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
        # 'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'common.config.config_auth.useBearerForAuth',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '3/second',
        'user': '1000/day'
    },
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination'
}


# JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=50),
    "SIGNING_KEY": config("SECRET_KEY"),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ('Bearer',),

    # "AUTH_COOKIE": 'access',
    "AUTH_COOKIE_REFRESH": 'refresh',
    # "AUTH_COOKIE_DOMAIN": None,
    "AUTH_COOKIE_SAMESITE": 'Lax',  # 'Lax', 'Strict', 'None'
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_PATH": '/',
    "AUTH_COOKIE_SECURE": False,

}

# ---- ELASTIC SEARCH ----
ELASTIC_USERNAME = config('ELASTIC_USERNAME')
ELASTIC_PASSWORD = urlquote(config('ELASTIC_PASSWORD'))
HOST_IP = '127.0.0.1'
HOST_PORT = '9200'

elastic_url = f"elasticsearch://{ELASTIC_USERNAME}:{ELASTIC_PASSWORD}@{HOST_IP}:{HOST_PORT}"

ELASTICSEARCH_DSL = {
    "default": {
        "hosts": [
            # "elasticsearch:9200",
            # 'http:localhost:9200',
            elastic_url,
        ],
        # "http_auth": ("elastic", ELASTIC_PASSWORD),
        # "hosts": "localhost:9200"
    }
}

ELASTICSEARCH_INDEX_NAMES = {
    # 'product.productitem': 'productitem',
    'search.documents.productitem': 'productitem',
}

PAGE_SIZE = 5
MAX_PAGE_SIZE_LIMIT = 30
# REST_AUTH_SERIALIZERS = {
#     'USER_DETAILS_SERIALIZER': 'users.serializers.UserSerializer',
#     'TOKEN_SERIALIZER': 'users.serializers.TokenSerializer'
#     # 'LOGIN_SERIALIZER': 'users.serializers.CustomLoginSerializer'
# }

# REST_AUTH_REGISTER_SERIALIZERS = {
#     'REGISTER_SERIALIZER': 'users.serializers.CustomRegisterSerializer',
# }


#  SMTP SETTINGS

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST_USER = config('EMAIL_HOST')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
EMAIL_RECEIVERS_LIST = [config('EMAIL_RECEIVER_ONE'),]
