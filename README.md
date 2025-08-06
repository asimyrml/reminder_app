# 🧠 Reminder App

Kendi kişisel hatırlatıcı ve not alma asistanınızı oluşturun! Bu uygulama ile:

- Zamanlanmış hatırlatıcılar ayarlayabilir,
- Notlar oluşturabilir,
- Tek seferlik veya tekrar eden hatırlatmalar planlayabilir,
- E-mail ile bildirimler alabilirsiniz.

## 🚀 Özellikler

- ✅ Not oluşturma ve listeleme
- ✅ Hatırlatıcı ekleme (tekrarlı veya tek seferlik)
- ✅ SweetAlert2 destekli kullanıcı dostu arayüz
- ✅ Flatpickr ile tarih-saat seçici
- ✅ Celery + Redis ile arka plan görevleri
- ✅ E-mail bildirim desteği
- ✅ Modern ve responsive UI (Bootstrap 5)
- ✅ Docker ile hızlı kurulum

## 🛠️ Kullanılan Teknolojiler

| Katman       | Teknoloji                       |
|--------------|----------------------------------|
| Backend      | Django, Celery, PostgreSQL       |
| Frontend     | Bootstrap 5, JavaScript, Flatpickr |
| Queue        | Redis                            |
| Mail         | Django Email Backend             |
| Deployment   | Docker, Docker Compose           |

---

## ⚙️ Kurulum

### 1. Depoyu klonlayın
```bash
git clone https://github.com/kullanici/reminder-app.git
cd reminder-app
```

### 2. .env dosyasını oluşturun
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=*

POSTGRES_DB=reminderdb
POSTGRES_USER=reminderuser
POSTGRES_PASSWORD=reminderpass

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=youremail@gmail.com
EMAIL_HOST_PASSWORD=yourpassword
DEFAULT_FROM_EMAIL=Reminder App <noreply@reminderapp.com>


Gmail SMTP kullanacaksan uygulama şifresi kullanman önerilir.

### 3. Docker ile ayağa kaldırın

```bash
docker compose up --build
```

Servisler:

- Django → http://localhost:8000
- Flower (Task Monitor) → http://localhost:5555

## ✉️ E-mail Gönderimi
Hatırlatıcı zamanı geldiğinde, kullanıcıya bir email gönderilir. Notlar için de opsiyonel hatırlatma zamanı verilebilir.

Görevler:
- `send_reminder_email`: hatırlatma zamanı geldiğinde çalışır
- `schedule_interval_reminder`: belirli aralıklarla tekrar eden hatırlatıcılar için kullanılır

## 🧪 Örnek .env ve kullanıcı
```bash
python manage.py createsuperuser
# Sonra panel: http://localhost:8000/admin
```

## 📁 Klasör Yapısı (Özet)

```
reminder_app/
│
├── core/                 # Uygulama mantığı ve task'lar
├── templates/            # HTML dosyaları
├── static/               # CSS, JS, ikonlar
├── reminder_app/         # Django ayarları
│   └── celery.py         # Celery konfigurasyonu
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📌 Yol Haritası
-Tek seferlik hatırlatıcılar
- Belirli aralıklarla tekrarlayan hatırlatmalar
- Haftalık / aylık tekrar
- Kullanıcıya timezone desteği
- Push Notification (opsiyonel)
- Mobil uyumlu PWA (Progressive Web App)

---

## 💬 Katkı Sağlamak
- Geliştirilmesi gereken bir alan görürseniz, öneriniz olursa veya sadece sohbet etmek isterseniz, iletişimde kalmaktan çekinmeyin. Her geri bildirim projenin daha iyi hale gelmesine katkı sağlar!
