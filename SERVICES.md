# 🔧 Servis Başlatma Kılavuzu

## 1. Redis Başlat

```bash
redis-server
```

## 2. Django Sunucusunu Başlat
```bash
python manage.py runserver
```

## 3. Celery Worker Başlat

```bash
celery -A reminder_app worker --loglevel=info --pool=solo
```

## 4. Flower İzleyiciyi Başlat (Opsiyonel)

```bash
celery -A reminder_app flower
```
#### ➡ http://localhost:5555 üzerinden takip edebilirsin.
