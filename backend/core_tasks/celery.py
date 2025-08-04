import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'e_shop.settings.dev')
app = Celery('e_shop')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
