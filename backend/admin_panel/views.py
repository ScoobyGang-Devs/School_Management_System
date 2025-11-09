from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from .models import *
from django.contrib.auth import login
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view

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

class ClassroomDetailView(APIView):
    def get(self, request, teacherId):
        try:
            teacher = TeacherDetail.objects.select_related('assignedClass').get(teacherId=teacherId)
        except TeacherDetail.DoesNotExist:
            return Response({'error':'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

        students = teacher.assignedClass.students.all()

        teacherSerializer = TeacherDetailsSerializer(teacher)
        studentsSerializer = StudentDetailsSerializer(students, many=True)

        return Response({
            "teacher": teacherSerializer.data,
            "students": studentsSerializer.data
        })
    

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response({"message": "Logged in successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
def signup_api(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {"message": "User created successfully", "token": token.key},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({"message": "Login successful", "token": token.key})

    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
