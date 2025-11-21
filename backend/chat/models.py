from django.db import models

class Message(models.Model):
    CATEGORY_CHOICES = [
        ("personal", "Personal"),
        ("urgent", "Urgent"),
        ("announcement", "Announcement"),
    ]

    sender = models.CharField(max_length=255)
    sender_email = models.EmailField()
    receivers = models.JSONField() 
    subject = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    urgent = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    read_status = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.subject} - {self.sender}"
