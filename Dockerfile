FROM python:3.12-slim

# Ortam ayarları
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Çalışma dizini
WORKDIR /app

# Gereken bağımlılıkları yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Proje dosyalarını kopyala
COPY . .

# Statik dosyaları topla
RUN python manage.py collectstatic --noinput

# Port aç
EXPOSE 8000

# Django sunucusu başlat
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
