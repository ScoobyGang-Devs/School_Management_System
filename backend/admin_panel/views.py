from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializers import *
from .models import *
from .permissions import IsStaffUser
from attendence.models import studentAttendence
from term_test.models import TermTest
from datetime import date



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

class StudentsCreateView(generics.CreateAPIView):
        
        def post(self, request, *args, **kwargs):
            serializer = StudentDetailsSerializer(data=request.data)
        
            if serializer.is_valid():
                student = serializer.save()
                return Response(StudentDetailsSerializer(student).data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            return Response(
                {"message": "User created successfully."},
                status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class StudentGradeSummary(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        summary = {}
        for grade in range(6, 12):
            count = StudentDetail.objects.filter(enrolledClass__grade=grade).count()
            summary[f"Grade {grade}"] = count
        return Response(summary)

class StudentGradeClassSummary(APIView):
    
    # permission_classes = [IsStaffUser]
    permission_classes = [AllowAny]

    def get(self, request, grade):
        summary = {}

        classes = Classroom.objects.filter(grade=grade)

        for classroom in classes:
            count = StudentDetail.objects.filter(enrolledClass=classroom).count()
            summary[str(classroom)] = count
        
        return Response(summary)
    
class StudentByGradeList(generics.ListAPIView):
    serializer_class = StudentDetailSerializer
    # permission_classes = [IsStaffUser]
    permission_classes = [AllowAny]
    #for TEMPORARY testing purposes I changed the permission classes -selith

    def get_queryset(self):
        grade = self.kwargs['grade']
        return StudentDetail.objects.filter(enrolledClass__grade=grade)
    


class GradeRosterAPIView(APIView):
    """
    Returns a list of students in a given grade with:
    - Name
    - Attendance status for today
    - Average score across all term tests
    """
    def get(self, request, grade, classname):
        today = date.today()

        # Correct filtering
        students = StudentDetail.objects.filter(
            enrolledClass__grade=grade,
            enrolledClass__className=classname
        )

        roster = []

        for student in students:
            # Attendance status for today
            attendance_record = studentAttendence.objects.filter(
                studentId=student, date=today
            ).first()
            attendance_status = attendance_record.status if attendance_record else "Not Marked"

            # Average score across all term tests
            term_tests = TermTest.objects.filter(student=student)
            if term_tests.exists():
                avg_score = round(sum(test.average for test in term_tests) / term_tests.count(), 2)
            else:
                avg_score = None



            roster.append({
                "name": student.fullName,
                "attendance_today": attendance_status,
                "score_avg": avg_score
            })

        return Response(roster, status=status.HTTP_200_OK)
    
