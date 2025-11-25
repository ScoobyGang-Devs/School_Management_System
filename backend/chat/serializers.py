from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_name = serializers.SerializerMethodField()
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'sender_id', 'sender_name', 'subject', 'content',
            'recipients', 'timestamp', 'category', 'is_read'
        ]

    def get_sender_name(self, obj):
        user = obj.sender
        if hasattr(user, "teacher_profile"):
            return user.teacher_profile.nameWithInitials
        elif hasattr(user, "admin_profile"):
            return user.admin_profile.nameWithInitials
        return user.username

    def get_is_read(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        user_id = str(request.user.id)
        return obj.read_status.get(user_id, False)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if isinstance(instance.recipients, list) and instance.recipients == ["ALL"]:
            rep['recipients'] = "ALL"
        return rep


class UserListSerializerChat(serializers.ModelSerializer):
    nameWithInitials = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'nameWithInitials']

    def get_nameWithInitials(self, obj):
        if hasattr(obj, "teacher_profile"):
            return obj.teacher_profile.nameWithInitials
        if hasattr(obj, "admin_profile"):
            return obj.admin_profile.nameWithInitials
        return obj.username
