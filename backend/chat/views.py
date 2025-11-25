from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from django.contrib.auth.models import User

from .models import Message
from .serializers import MessageSerializer, UserListSerializerChat


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


        if category not in ['personal', 'urgent', 'announcement']:
            return Response({"error": "Invalid category"}, status=400)


        if category == "announcement":
            all_user_ids = list(User.objects.all().values_list("id", flat=True))
            recipients = ["ALL"]  
            read_status = {str(uid): False for uid in all_user_ids}

        else:
            
            try:
                recipients = [int(x) for x in recipients]
            except:
                return Response({"error": "Recipients must be numeric user IDs"}, status=400)

            
            valid_recips = list(
                User.objects.filter(id__in=recipients).values_list("id", flat=True)
            )
            if not valid_recips:
                return Response({"error": "No valid recipients"}, status=400)

            read_status = {str(uid): False for uid in valid_recips}

        
        message = Message.objects.create(
            sender=sender,
            recipients=recipients,
            subject=subject,
            content=content,
            category=category,
            urgent=(category == 'urgent'),
            read_status=read_status
        )

        return Response({
            "message_id": message.id,
            "sender_id": sender.id,
            "sender_name": (
                sender.teacher_profile.nameWithInitials
                if hasattr(sender, "teacher_profile") else
                sender.admin_profile.nameWithInitials
                if hasattr(sender, "admin_profile") else
                sender.username
            )
        }, status=201)

    
    @action(detail=False, methods=['get'])
    def inbox(self, request):
        user_id = request.user.id

        messages = []
        for msg in Message.objects.all().order_by('-timestamp'):
            
            if msg.recipients == ["ALL"]:
                messages.append(msg)
                continue
            
            if user_id in msg.recipients:
                messages.append(msg)

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

    
    @action(detail=False, methods=['get'])
    def sent(self, request):
        messages = Message.objects.filter(sender=request.user).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        data = serializer.data
        for msg in data:
            msg.pop('is_read', None)
        return Response(data)

    
    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        user_id = str(request.user.id)
        message = self.get_object()

        if user_id not in message.read_status:
            return Response({"error": "You are not a recipient"}, status=403)

        message.read_status[user_id] = True
        message.save(update_fields=['read_status'])

        return Response({
            "message_id": message.id,
            "read_status": message.read_status
        })

class UserListViewChat(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializerChat
