from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.utils.dateparse import parse_datetime
from .models import Reminder, Note
from django.utils.timezone import make_aware, is_naive

@login_required(login_url='login')
def index(request):
    reminders = Reminder.objects.filter(user=request.user)  # sadece kullanıcıya ait
    notes = Note.objects.filter(user=request.user)  # sadece kullanıcıya ait notlar

    context = {
        'reminders': reminders,
        'notes': notes,
    }
    return render(request, 'index.html', context)


@login_required(login_url='login')
@require_POST
def create_reminder(request):
    title = request.POST.get('title')
    description = request.POST.get('description', '')
    remind_at_str = request.POST.get('remind_at')
    repeat_type = request.POST.get('repeat_type', 'none')
    interval_minutes = request.POST.get('interval_minutes')
    day_of_month = request.POST.get('day_of_month')
    day_of_week = request.POST.get('day_of_week')

    remind_at = parse_datetime(remind_at_str) if remind_at_str else None
    if remind_at and is_naive(remind_at):
        remind_at = make_aware(remind_at)

    if not title or not remind_at:
        return JsonResponse({'success': False, 'message': 'Başlık ve tarih zorunludur.'})

    reminder = Reminder.objects.create(
        user=request.user,
        title=title,
        description=description,
        date=remind_at,
        repeat_type=repeat_type,
        interval_minutes=int(interval_minutes) if repeat_type == 'interval' and interval_minutes else None,
        day_of_month=int(day_of_month) if repeat_type == 'custom_day' and day_of_month else None,
        day_of_week=int(day_of_week) if repeat_type == 'custom_weekday' and day_of_week else None,
    )

    return JsonResponse({
        'success': True,
        'message': 'Hatırlatıcı başarıyla oluşturuldu.',
        'reminder': {
            'id': reminder.id,
            'title': reminder.title,
            'date': reminder.date.strftime('%Y-%m-%d %H:%M'),
        }
    })


@login_required(login_url='login')
@require_POST
def create_note(request):
    title = request.POST.get('title')
    content = request.POST.get('content')
    reminder_date_str = request.POST.get('reminder_date')

    reminder_date = None
    if reminder_date_str:
        reminder_date = parse_datetime(reminder_date_str)
        if reminder_date and is_naive(reminder_date):
            reminder_date = make_aware(reminder_date)

    if not title or not content:
        return JsonResponse({'success': False, 'message': 'Başlık ve içerik zorunludur.'})

    note = Note.objects.create(
        user=request.user,
        title=title,
        content=content,
        reminder_date=reminder_date
    )

    return JsonResponse({
        'success': True,
        'message': 'Not başarıyla oluşturuldu.',
        'note': {
            'id': note.id,
            'title': note.title,
            'content': note.content[:50] + ('...' if len(note.content) > 50 else ''),
            'reminder_date': note.reminder_date.strftime('%Y-%m-%d %H:%M') if note.reminder_date else None
        }
    })



@require_POST
def delete_reminder(request, reminder_id):
    try:
        reminder = Reminder.objects.get(id=reminder_id, user=request.user)
        reminder.delete()
        return JsonResponse({'success': True, 'message': 'Hatırlatıcı silindi.'})
    except Reminder.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Hatırlatıcı bulunamadı.'})

@require_POST
def delete_note(request, note_id):
    try:
        note = Note.objects.get(id=note_id, user=request.user)
        note.delete()
        return JsonResponse({'success': True, 'message': 'Not silindi.'})
    except Note.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Not bulunamadı.'})