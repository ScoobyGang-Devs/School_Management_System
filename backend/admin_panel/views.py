from django.shortcuts import render
from rest_framework import generics
from .models import guardian_details
from .serializers import guardianSerializer
from .serializers import StudentDetailsSerializer
from rest_framework import generics
from .models import StudentDetails

# Create your views here.
class guardianListCreateView(generics.ListCreateAPIView):
    queryset = guardian_details.objects.all()
    serializer_class = guardianSerializer

class guardianDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = guardian_details.objects.all()
    serializer_class = guardianSerializer

class StudentDetailsListCreateView(generics.ListCreateAPIView):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer

class StudentDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer
