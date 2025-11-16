from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ChatRoom(models.Model):
    teachers = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Room {self.id}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def _str_(self):
        return f"{self.sender.username}: {self.content[:20]}"