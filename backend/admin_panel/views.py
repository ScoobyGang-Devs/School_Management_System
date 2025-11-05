from rest_framework import generics
from .models import *
from .serializers import *


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


class TeacherDetailsListCreateView(generics.ListCreateAPIView):
    queryset = TeacherDetails.objects.all()
    serializer_class = TeacherDetailsSerializer

class TeacherDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeacherDetails.objects.all()
    serializer_class = TeacherDetailsSerializer
