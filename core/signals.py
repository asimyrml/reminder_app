from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import now
from .models import Reminder, Note
from .tasks import send_reminder_email, schedule_interval_reminder

@receiver(post_save, sender=Reminder)
def schedule_reminder(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.repeat_type == Reminder.RepeatType.NONE:
        # Tek seferlik hatırlatıcı
        delay = (instance.date - now()).total_seconds()
        if delay > 0:
            send_reminder_email.apply_async(args=[instance.id], countdown=delay)

    elif instance.repeat_type == Reminder.RepeatType.INTERVAL and instance.interval_minutes:
        # Belirli aralıklarla tekrar eden
        schedule_interval_reminder.apply_async(args=[instance.id, instance.interval_minutes], countdown=0)

    elif instance.repeat_type in [Reminder.RepeatType.CUSTOM_DAY, Reminder.RepeatType.CUSTOM_WEEKDAY]:
        # Bu türler için Celery Beat entegrasyonu gerekir
        print(f"⚠️ Reminder ({instance.id}) requires periodic scheduling via Celery Beat.")


@receiver(post_save, sender=Note)
def schedule_note_reminder(sender, instance, created, **kwargs):
    if created and instance.reminder_date:
        delay = (instance.reminder_date - now()).total_seconds()
        if delay > 0:
            send_reminder_email.apply_async(
                args=[instance.id],
                countdown=delay,
                kwargs={'is_note': True}
            )