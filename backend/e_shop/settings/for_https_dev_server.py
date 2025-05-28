from .dev import *


# this is not mandatory as long as the server is used as a rest api
SITE_URL = 'https://localhost:8443'

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://localhost:5173",  # Vite dev server
    "https://localhost:8443",  # Backend through Stunnel
]

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTP_ONLY = True
CSRF_TRUSTED_ORIGINS = [
    "https://localhost:5173",
    "https://localhost:8443",
]

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTP_ONLY = True

CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]
