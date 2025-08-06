from django.core.management.base import BaseCommand
from django.core.mail import send_mail

class Command(BaseCommand):
    help = 'Send a test email'

    def handle(self, *args, **kwargs):
        send_mail(
            'Test Mail Subject',
            'Hello Asım, this is a test email from Django.',
            None,  # from_email boş bırakılırsa DEFAULT_FROM_EMAIL kullanılır
            ['asm14yrml@gmail.com'],  # Buraya kendi mailini yaz
            fail_silently=False,
        )
        self.stdout.write(self.style.SUCCESS('Test mail sent!'))
