from django.urls import path
from .views import random_note

urlpatterns = [
    path('random-note', random_note, name='random_note'),
]
