from celery import shared_task
from django.core.mail import send_mail
from .models import Reminder
from django.conf import settings
from accounts.models import User
from django.utils.timezone import now, timedelta


@shared_task(bind=True)
def send_reminder_email(self, object_id, is_note=False):
    try:
        if is_note:
            from .models import Note
            obj = Note.objects.get(id=object_id)
            subject = f"Not Hatırlatma: {obj.title}"
            message = obj.content
            email = obj.user.email
        else:
            from .models import Reminder
            obj = Reminder.objects.get(id=object_id)
            subject = f"Hatırlatma: {obj.title}"
            message = obj.description
            email = obj.user.email

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        return f"Email sent for {'Note' if is_note else 'Reminder'} {obj.title}"
    except Exception as e:
        return str(e)
    

@shared_task(bind=True)
def schedule_interval_reminder(self, reminder_id, interval_minutes):
    try:
        reminder = Reminder.objects.get(id=reminder_id)

        # Gönder
        send_reminder_email.delay(reminder.id)

        # Yeni zaman hesapla
        next_run = now() + timedelta(minutes=interval_minutes)
        if reminder.repeat_type == Reminder.RepeatType.INTERVAL:
            # Kendini tekrar çağır
            schedule_interval_reminder.apply_async(
                args=[reminder.id, interval_minutes],
                eta=next_run
            )
    except Reminder.DoesNotExist:
        return f"Reminder {reminder_id} not found."