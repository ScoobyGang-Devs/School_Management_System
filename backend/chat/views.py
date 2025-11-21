from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-timestamp')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send_message(self, request):
        sender = request.user.get_full_name() or request.user.username
        sender_email = request.user.email
        category = request.data.get('category')
        subject = request.data.get('subject')
        content = request.data.get('content')
        receivers = request.data.get('receivers', [])

        if category not in ['personal', 'urgent', 'announcement']:
            return Response({"error": "Invalid category"}, status=status.HTTP_400_BAD_REQUEST)

        if category == 'announcement' or receivers == "ALL":
            all_teachers = User.objects.filter(is_staff=True)
            receivers = [u.email for u in all_teachers]

        read_status = {email: False for email in receivers}

        message = Message.objects.create(
            sender=sender,
            sender_email=sender_email,
            receivers=receivers,
            subject=subject,
            content=content,
            category=category,
            urgent=(category == 'urgent'),
            read_status=read_status
        )

        serializer = MessageSerializer(message)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        message = self.get_object()
        user_email = request.user.email

        if user_email in message.read_status:
            message.read_status[user_email] = True
            message.save()
            return Response({"status": "marked as read"})
        else:
            return Response({"error": "You are not a recipient of this message"}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['get'])
    def my_messages(self, request):
        user_email = request.user.email
        messages = Message.objects.filter(receivers__contains=[user_email]).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
