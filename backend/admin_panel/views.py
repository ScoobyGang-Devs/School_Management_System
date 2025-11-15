from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
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

# class TeacherDetailsListCreateView(generics.ListCreateAPIView):
#     queryset = TeacherDetail.objects.all()
#     serializer_class = TeacherDetailsSerializer

class TeacherDetailsDetailView(generics.RetrieveUpdateAPIView):
    queryset = TeacherDetail.objects.all()
    serializer_class = TeacherDetailsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.teacher_profile

class ClassroomListCreateView(generics.ListCreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

class ClassroomDetailView(APIView):
    def get(self, request, teacherId):
        try:
            teacher = TeacherDetail.objects.select_related('assignedClass').get(teacherId=teacherId)
        except TeacherDetail.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

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
            user = serializer.save()
            return Response({
                'message': 'User created successfully.',
                'username': user.username,
                'email': user.email,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    