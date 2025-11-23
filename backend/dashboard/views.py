from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_panel.models import StudentDetail, TeacherDetail, Classroom, AdminProfile
from term_test.models import TermTest
from attendence.models import studentAttendence
from datetime import timedelta
from django.utils.timezone import now
from django.db.models import Count, Q, Avg



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