from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import *

# Create your views here.
class guardianListCreateView(generics.ListCreateAPIView):
    queryset = GuardianDetail.objects.all()
    serializer_class = guardianSerializer

class guardianDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GuardianDetail.objects.all()
    serializer_class = guardianSerializer

class StudentDetailsListCreateView(generics.ListCreateAPIView):
    queryset = StudentDetail.objects.all()
    serializer_class = StudentDetailsSerializer

class StudentDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentDetail.objects.all()
    serializer_class = StudentDetailsSerializer

class TeacherDetailsListCreateView(generics.ListCreateAPIView):
    queryset = TeacherDetail.objects.all()
    serializer_class = TeacherDetailsSerializer

class TeacherDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeacherDetail.objects.all()
    serializer_class = TeacherDetailsSerializer
