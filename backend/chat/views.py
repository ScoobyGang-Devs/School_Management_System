from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Message
from .serializers import MessageSerializer, UserListSerializerChat
from rest_framework.generics import ListAPIView


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-timestamp')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send_message(self, request):
        sender = request.user

        subject = request.data.get('subject')
        content = request.data.get('content')
        category = request.data.get('category')
        recipients = request.data.get('recipients', [])
        reply_to_id = request.data.get('reply_to_id')

        if category not in ['personal', 'urgent', 'announcement']:
            return Response({"error": "Invalid category"}, status=400)

        if category == "announcement":
            recipients = list(User.objects.all().values_list("id", flat=True))

        valid_recips = list(
            User.objects.filter(id__in=recipients).values_list("id", flat=True)
        )

        if not valid_recips:
            return Response({"error": "No valid recipients"}, status=400)

        read_status = {str(uid): False for uid in valid_recips}

        reply_to = None
        if reply_to_id:
            reply_to = Message.objects.filter(id=reply_to_id).first()

        message = Message.objects.create(
            sender=sender,
            recipients=valid_recips,
            subject=subject,
            content=content,
            category=category,
            urgent=(category == 'urgent'),
            read_status=read_status,
            reply_to=reply_to
        )

        return Response({"id": message.id}, status=201)

    @action(detail=False, methods=['get'])
    def inbox(self, request):
        user_id = request.user.id

        messages = [
            msg for msg in Message.objects.all().order_by('-timestamp')
            if user_id in msg.recipients
        ]

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        sender = request.user
        messages = Message.objects.filter(sender=sender).order_by('-timestamp')

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        data = serializer.data

        for msg in data:
            msg.pop('is_read', None)

        return Response(data)

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        user_id = str(request.user.id)

        try:
            message = self.get_object()
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=404)

        if user_id not in message.read_status:
            return Response({"error": "You are not a recipient"}, status=403)

        message.read_status[user_id] = True
        message.save(update_fields=['read_status'])

        serializer = MessageSerializer(message, context={'request': request})
        return Response(serializer.data)


class UserListViewChat(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializerChat
