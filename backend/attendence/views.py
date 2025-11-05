from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import *

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
