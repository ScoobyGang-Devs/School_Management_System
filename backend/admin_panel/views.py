from django.shortcuts import render
from rest_framework import generics
from .models import guardian_details
from .serializers import guardianSerializer

# Create your views here.
class guardianListCreateView(generics.ListCreateAPIView):
    queryset = guardian_details.objects.all()
    serializer_class = guardianSerializer

class guardianDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = guardian_details.objects.all()
    serializer_class = guardianSerializer
