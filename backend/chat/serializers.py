from rest_framework import serializers
from .models import Message
from django.contrib.auth.models import User

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender_teacher.teacherId', read_only=True)
    sender_name = serializers.CharField(source='sender_teacher.fullName', read_only=True)
    recipients = serializers.ListField(child=serializers.IntegerField(), read_only=True)
    is_read = serializers.SerializerMethodField()
    reply_to_id = serializers.IntegerField(source='reply_to.id', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender_id', 'sender_name', 'subject', 'content',
            'recipients', 'timestamp', 'category', 'is_read', 'reply_to_id'
        ]

    def get_is_read(self, obj):
        teacher = getattr(self.context.get('request').user, 'teacher_profile', None)
        if not teacher:
            return False
        return obj.read_status.get(str(teacher.teacherId), False)
    

# serializer for sending usernames and userIds to frontend for messaging
class UserListSerializerChat(serializers.ModelSerializer):

    userName = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userName', 'id']

    def get_userName(self, obj):
        if hasattr(obj, "teacher_profile"):
            return obj.teacher_profile.nameWithInitials
        elif hasattr(obj, "admin_profile"):
            return obj.admin_profile.nameWithInitials
        else:
            return obj.get_username()