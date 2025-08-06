from __future__ import absolute_import, unicode_literals

# Celery instance'ını import et
from reminder_app.celery import app as celery_app

__all__ = ('celery_app',)
