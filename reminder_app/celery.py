import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reminder_app.settings')

app = Celery('reminder_app')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Tüm taskleri tanıması için autodiscover
app.autodiscover_tasks()
