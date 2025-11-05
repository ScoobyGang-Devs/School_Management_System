from .serializers import StudentDetailsSerializer
from rest_framework import generics
from .models import StudentDetails

# Create your views here.
class StudentDetailsListCreateView(generics.ListCreateAPIView):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer

class StudentDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer