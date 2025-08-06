```
reminder_app/
│
├── manage.py
│
├── accounts/
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│   └── __init__.py
│
├── core/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── signals.py
│   ├── tasks.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│   ├── __init__.py
│   │
│   ├── management/
│   │   ├── __init__.py
│   │   └── commands/
│   │       ├── __init__.py
│   │       └── send_test_mail.py
│   │
│   └── migrations/
│       ├── 0001_initial.py
│       └── __init__.py
│
├── reminder_app/
│   ├── asgi.py
│   ├── celery.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── __init__.py
```