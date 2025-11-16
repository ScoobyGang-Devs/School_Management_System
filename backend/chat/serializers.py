from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    receivers = serializers.ListField(child=serializers.EmailField(), read_only=True)
    read_status = serializers.DictField(child=serializers.BooleanField(), read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_email', 'receivers',
            'subject', 'content', 'category', 'urgent',
            'timestamp', 'read_status'
        ]

