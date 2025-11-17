from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from admin_panel.models import StudentDetail
from rest_framework.response import Response


# Create your views here.

class studentAttenenceListCreateView(generics.ListCreateAPIView):
    queryset = studentAttendence.objects.all()
    serializer_class = studentAttendenceSerializer

class studentAttendenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = studentAttendence.objects.all()
    serializer_class = studentAttendenceSerializer

class teacherAttenenceListCreateView(generics.ListCreateAPIView):
    queryset = teacherAttendence.objects.all()
    serializer_class = teacherAttendenceSerializer

class teacherAttendenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = studentAttendence.objects.all()
    serializer_class = teacherAttendenceSerializer

class attendenceOfStudentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, indexNumber, date):
        student = get_object_or_404(StudentDetail, indexNumber=indexNumber)
        attendence = studentAttendence.objects.filter(
            studentId = student.indexNumber,
            date = date
        ).first()

        return Response({
            "studentId" : student.indexNumber,
            "studentName" : student.fullName,
            "date" : date,
            "status" : attendence.status
            })

