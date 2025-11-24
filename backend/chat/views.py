from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from admin_panel.models import TeacherDetail
 

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-timestamp')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send_message(self, request):
        sender_teacher = getattr(request.user, 'teacher_profile', None)
        if not sender_teacher:
            return Response({"error": "Only teachers can send messages"}, status=403)

        subject = request.data.get('subject')
        content = request.data.get('content')
        category = request.data.get('category')
        recipients = request.data.get('recipients', [])
        reply_to_id = request.data.get('reply_to_id', None)

        if category not in ['personal', 'urgent', 'announcement']:
            return Response({"error": "Invalid category"}, status=400)

        if category == 'announcement' or recipients == "ALL":
            recipients = list(TeacherDetail.objects.all().values_list('teacherId', flat=True))
        else:
            recipients = list(TeacherDetail.objects.filter(teacherId__in=recipients).values_list('teacherId', flat=True))

        if not recipients:
            return Response({"error": "No valid teacher recipients"}, status=400)

        read_status = {str(tid): False for tid in recipients}

        reply_to = None
        if reply_to_id:
            try:
                reply_to = Message.objects.get(id=reply_to_id)
            except Message.DoesNotExist:
                return Response({"error": "Reply-to message not found"}, status=404)

        message = Message.objects.create(
            sender_teacher=sender_teacher,
            recipients=recipients,
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
        teacher = getattr(request.user, 'teacher_profile', None)
        if not teacher:
            return Response({"error": "Only teachers can access inbox"}, status=403)

        teacher_id = teacher.teacherId

        messages = [
            msg for msg in Message.objects.all().order_by('-timestamp')
            if teacher_id in msg.recipients
        ]

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)  

    @action(detail=False, methods=['get'])
    def sent(self, request):
        teacher = getattr(request.user, 'teacher_profile', None)
        if not teacher:
            return Response({"error": "Only teachers can access sent messages"}, status=403)

        messages = Message.objects.filter(sender_teacher=teacher).order_by('-timestamp')
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        data = serializer.data
        for msg in data:
            msg.pop('is_read', None) 
        return Response(data)

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        
        teacher = getattr(request.user, 'teacher_profile', None)
        if not teacher:
            return Response({"error": "Only teachers can mark messages as read"}, status=403)

        try:
            message = self.get_object()
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=404)

        teacher_id = str(teacher.teacherId)
        if teacher_id not in message.read_status:
            return Response({"error": "You are not a recipient of this message"}, status=403)

        message.read_status[teacher_id] = True
        message.save(update_fields=['read_status'])

        serializer = MessageSerializer(message, context={'request': request})
        return Response(serializer.data)