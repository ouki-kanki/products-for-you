import os

# TODO: check this because it may be for an legacy version

from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "home.settings.prod")

application = get_wsgi_application()
application = DjangoWhiteNoise(application)