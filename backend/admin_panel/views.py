from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializers import *
from .models import *
from .permissions import IsStaffUser
from attendence.models import *
from term_test.models import *
from datetime import date
from term_test.models import *
from django.db.models import Avg


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
    # permission_classes = [IsStaffUser]

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
    serializer_class = StudentDetailsSerializer
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
    
class teacherClassView(APIView):

    """
    This view receives a teacherId from the frontend and returns
    the teacher's assigned class and teaching classes.
    """

    def post(self,request):
        serializer = teachersClassViewSerializer(data = request.data)

        if serializer.is_valid():
            teacherId = serializer.validated_data['teacherId']
            teacherDetail = TeacherDetail.objects.filter(teacherId = teacherId).first()

            if not teacherDetail:
                return Response(
                    {"error": "Teacher not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            assigned_class_data = f"{teacherDetail.assignedClass.grade} {teacherDetail.assignedClass.className}"
            teaching_classes_data = [
                f"{c.grade} {c.className}" for c in teacherDetail.teachingClasses.all()
            ]
            responseData = {
                "assignedClass":assigned_class_data,
                "teachingClasses":teaching_classes_data

            }

            return Response(
                responseData,
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer

class teacherClassResultView(APIView):
    """
    This view receives a teacherID from the frontend and returns
    the teacher's assigned class reults.
    """
    permission_classes = [AllowAny]
    def get(self,request,grade,className,subjectName ):

        try:
            teacher = TeacherDetail.objects.get(owner=request.user)
        except TeacherDetail.DoesNotExist:
            return Response({"error": "Teacher profile not found"}, status=404)

        try:
            class_obj = Classroom.objects.get(grade=grade, className=className)
        except Classroom.DoesNotExist:
            return Response({"error": "Class not found"}, status=404)

        if class_obj not in teacher.teachingClasses.all():
            return Response({"error": "You do not teach this class"}, status=403)
        
        try:
            subject_obj = Subject.objects.get(subjectName=subjectName)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=404)

        if subject_obj not in teacher.teachingSubjects.all():
            return Response({"error": "You do not teach this subject"}, status=403)
                
        marks_qs = SubjectwiseMark.objects.filter(
            studentID__classID=class_obj,
            subject=subject_obj,
            teacherID=teacher
        )

        # 5. Calculate average
        average_marks = marks_qs.aggregate(avg_marks=Avg('marksObtained'))['avg_marks']

        return Response({
            "class": f"{grade}{className}",
            "subject": subjectName,
            "average_marks": round(average_marks or 0, 2)  # handle None
        })