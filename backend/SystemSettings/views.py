from django.shortcuts import render
from .models import *
from rest_framework import generics,status
from .serializers import *

# Create your views here.
class SchoolDetailListCreateView(generics.ListCreateAPIView):
    queryset = SchoolDetail.objects.all()
    serializer_class = SchoolDetailSerializer





