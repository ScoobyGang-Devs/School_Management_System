# chat models
from django.db import models
from django.contrib.auth.models import User
from admin_panel.models import TeacherDetail


class Message(models.Model):
    CATEGORY_CHOICES = [
        ("personal", "Personal"),
        ("urgent", "Urgent"),
        ("announcement", "Announcement"),
    ]

    sender_teacher = models.ForeignKey(
        TeacherDetail, on_delete=models.CASCADE, related_name='sent_messages'
    )
    recipients = models.JSONField() 
    subject = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    urgent = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    read_status = models.JSONField(default=dict) 
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.subject} - {self.sender_teacher.teacherId}"
