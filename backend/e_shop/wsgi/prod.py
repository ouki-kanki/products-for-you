import os
from django.core.wsgi import get_wsgi_application

# NOTE: whitenoise is not needed if django acts as a rest service
# also there is info that whitenoise in later versions of django is intergrated
# inside the framework
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "e_shop.settings.prod")
application = get_wsgi_application()
