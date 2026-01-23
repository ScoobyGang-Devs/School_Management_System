from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_panel.models import StudentDetail, TeacherDetail, Classroom, AdminProfile, ClassSubjectAssignment
from term_test.models import TermTest, SubjectwiseMark
from attendence.models import studentAttendence
from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Count, Q, Avg
from rest_framework.permissions import IsAuthenticated



# ------ Admin - Dashboard - View ---------
class AdminDashboardView(APIView):

    def get(self, request):
        today = now().date()
        five_days_ago = today - timedelta(days=5)

        # 1. Total number of students
        total_students = StudentDetail.objects.count()

        # 2. Total number of staff
        total_staff = TeacherDetail.objects.count() + AdminProfile.objects.count()

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

        attendance_records = (
            studentAttendence.objects
            .filter(date__range=(five_days_ago, today - timedelta(days=1)))
            .select_related("className")
            .order_by('date')
        )

        attendance_list = []
        for record in attendance_records:
            classroom = record.className                       # Classroom instance
            total_students = classroom.students.count()        # Count students in class
            absent_count = len(record.absentList or [])        # Handle null JSON
            present_count = total_students - absent_count

        attendance_list.append({
            "date": record.date,
            "class": str(classroom),                       # Example: "6 A"
            "present_count": present_count,
            "absent_count": absent_count,
            "total_students": total_students,
            })

        return Response({
            "total_students": total_students,
            "total_staff": total_staff,
            "grade_averages": grade_averages,
            "attendance_last_5_days": attendance_list
        })
    
class TeacherDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        user = request.user
        teacher = TeacherDetail.objects.filter(owner = user).first()

        if not teacher:
            return Response({"error": "Teacher profile not found"}, status=404)

        # 1. Total number of teaching classes
        totalTeachingClasses = teacher.teachingClasses.count()

        # 2. assigned_class
        assignedClass = teacher.assignedClass

        # 3. Teacher's name
        teacherName = f"{teacher.title} . {teacher.nameWithInitials}"

        teachingClasses = teacher.teachingClasses.all()

        classData = []

        for clz in teachingClasses:

            studentCount = StudentDetail.objects.filter(enrolledClass = clz).count()

            subjectAssign = ClassSubjectAssignment.objects.filter(teacher = teacher ,classroom = clz).first()

            if not subjectAssign:
                classData.append({
                    "Classroom": str(clz),   # <--- CHANGE 2: Use str() or clz.className
                    "Subject": "Not Assigned",
                    "studentCount": studentCount,
                    "avg_marks": 0
                })
                continue

            marks_qs = SubjectwiseMark.objects.filter(
            studentID__enrolledClass=clz,
            subject=subjectAssign.subject,
            )

            average_marks = marks_qs.aggregate(avg_marks=Avg('marksObtained'))['avg_marks']

            classData.append({
                "Classroom":str(clz),
                "Subject": str(subjectAssign.subject),
                "studentCount":studentCount,
                "avg_marks":average_marks if average_marks else 0
            })

        return Response({
            "teacherName":teacherName,
            "totalClasses":totalTeachingClasses,
            "teacher'sClassData":classData
        })
        

        

        




    