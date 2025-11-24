from django.shortcuts import render
from .models import *
from rest_framework import generics,status, permissions
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response

class SchoolDetailListCreateView(generics.ListCreateAPIView):
    queryset = SchoolDetail.objects.all()
    serializer_class = SchoolDetailSerializer

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AcademicCycleConfigView(generics.RetrieveUpdateAPIView):
    queryset = AcademicCycleConfig.objects.all()
    serializer_class = AcademicCycleConfigSerializer
    # permission_classes = [permissions.IsAdminUser]
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return AcademicCycleConfig.objects.first()  # Singleton pattern