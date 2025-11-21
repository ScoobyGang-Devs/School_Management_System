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
from datetime import date, timedelta
from django.db.models import Count, Q, Avg
from django.utils.timezone import now
from admin_panel.models import *

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

#BECAUSE THE ATTENDANCE MODEL WAS CHANGED , the student database page did not work .. so I replaced it ... poddak passe blpn meke awla  
# class GradeRosterAPIView(APIView):
#     """
#     Returns a list of students in a given grade with:
#     - Name
#     - Attendance status for today
#     - Average score across all term tests
#     """
#     def get(self, request, grade, classname):
#         today = date.today()

#         # Correct filtering
#         students = StudentDetail.objects.filter(
#             enrolledClass__grade=grade,
#             enrolledClass__className=classname
#         )

#         roster = []

#         for student in students:
#             # Attendance status for today
#             attendance_record = studentAttendence.objects.filter(
#                 studentId=student, date=today
#             ).first()
#             attendance_status = attendance_record.status if attendance_record else "Not Marked"

#             # Average score across all term tests
#             term_tests = TermTest.objects.filter(student=student)
#             if term_tests.exists():
#                 avg_score = round(sum(test.average for test in term_tests) / term_tests.count(), 2)
#             else:
#                 avg_score = None




        #     roster.append({
        #         "name": student.fullName,
        #         "attendance_today": attendance_status,
        #         "score_avg": avg_score
        #     })

        # return Response(roster, status=status.HTTP_200_OK)

class GradeRosterAPIView(APIView):
    """
    FIXED: Returns only the basic roster (ID and Name) for Mark Entry 
    by removing the crashing lookups for Attendance and TermTest averages.
    """
    def get(self, request, grade, classname):
        
        # 1. Retrieve students for the given class, robustly handling case
        students = StudentDetail.objects.filter(
            enrolledClass__grade=grade,
            enrolledClass__className__iexact=classname # Use iexact for robust matching
        ).order_by('indexNumber')


        roster = []

        for student in students:
            term_tests = TermTest.objects.filter(student=student)
            if term_tests.exists():
                avg_score = round(sum(test.average for test in term_tests) / term_tests.count(), 2)
            else:
                avg_score = None
            # IMPORTANT: All crashing logic (attendance_record and term_tests lookup) is REMOVED
            # This ensures the view returns the basic list immediately.

            roster.append({
                "student_id": student.indexNumber,
                "name": student.fullName,
                "score_avg": avg_score
                # Note: We return indexNumber as 'student_id' as required by the frontend MarkEntryTable
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
    

class AdminDashboardView(APIView):
    def get(self, request):
        today = now().date()
        five_days_ago = today - timedelta(days=5)

        # 1. Total number of students
        total_students = StudentDetail.objects.count()

        # 2. Total number of staff
        total_staff = TeacherDetail.objects.count()

        # 3. Gradewise average results (from TermTest)
        grade_averages = {}
        for cls in Classroom.objects.all():
            avg = (
                TermTest.objects
                .filter(student__enrolledClass=cls)
                .aggregate(avg_score=Avg('average'))['avg_score']
            )
            grade_averages[str(cls)] = round(avg, 2) if avg is not None else None

        # 4. Student attendance in last 5 days by class
        attendance_qs = (
            studentAttendence.objects
            .filter(date__range=(five_days_ago, today - timedelta(days=1)))
            .values('date', 'studentId__enrolledClass')
            .annotate(present_count=Count('attendenceId', filter=Q(status='P')))
            .order_by('date')
        )

        attendance_list = []
        class_map = {cls.id: str(cls) for cls in Classroom.objects.all()}

        for record in attendance_qs:
            class_id = record['studentId__enrolledClass']
            attendance_list.append({
                "date": record['date'],
                "class": class_map.get(class_id, "Unknown"),
                "present_count": record['present_count']
            })

        return Response({
            "total_students": total_students,
            "total_staff": total_staff,
            "grade_averages": grade_averages,
            "attendance_last_5_days": attendance_list
        })
class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer

class teacherClassResultView(APIView):
    """
    This view receives a teacherID from the frontend and returns
    the teacher's assigned class reults.
    """
    permission_classes = [IsAuthenticated]
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
