from django.db import models
from django.conf import settings
from django.db import models

class Reminder(models.Model):
    class RepeatType(models.TextChoices):
        NONE = 'none', 'One-time'
        INTERVAL = 'interval', 'Repeat every X minutes'
        CUSTOM_DAY = 'custom_day', 'Monthly on specific day'
        CUSTOM_WEEKDAY = 'custom_weekday', 'Weekly on specific weekday'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateTimeField()

    repeat_type = models.CharField(
        max_length=20,
        choices=RepeatType.choices,
        default=RepeatType.NONE
    )
    interval_minutes = models.PositiveIntegerField(null=True, blank=True)
    day_of_month = models.PositiveIntegerField(null=True, blank=True)
    day_of_week = models.PositiveSmallIntegerField(null=True, blank=True)  # 0=Monday, 6=Sunday

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title




class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # İsteğe bağlı olarak nota reminder ekleme
    reminder_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']