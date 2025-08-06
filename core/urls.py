from django.contrib import admin
from django.urls import path, include
from . import views
from core.views import index

urlpatterns = [
    path('', index, name='home'),
    path('create-reminder/', views.create_reminder, name='create_reminder'),
    path('create-note/', views.create_note, name='create_note'),
    path('reminders/delete/<int:reminder_id>/', views.delete_reminder, name='delete_reminder'),
    path('notes/delete/<int:note_id>/', views.delete_note, name='delete_note'),
]
