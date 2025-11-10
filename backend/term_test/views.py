from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *

# Create your views here.

class TermTestListCreateView(generics.ListCreateAPIView):
    queryset = TermTest.objects.all()
    serializer_class = TermTestSerializer


class TermTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TermTest.objects.all()
    serializer_class = TermTestSerializer

class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer