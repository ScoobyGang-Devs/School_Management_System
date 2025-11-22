from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

########## remove these after u add somthing here
class aview(APIView):
    def get(self, request):
        return Response({"message":"Done!"},status=status.HTTP_200_OK)
############