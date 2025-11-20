from django.urls import path
from .views import SendMessageAPI, InboxAPI, SentAPI

urlpatterns = [
    path('', SendMessageAPI.as_view(), name='send-message'),
    path('inbox/<int:user_id>/', InboxAPI.as_view(), name='inbox'),
    path('sent/<int:user_id>/', SentAPI.as_view(), name='sent'),
]