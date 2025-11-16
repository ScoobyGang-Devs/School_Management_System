from django.urls import path
from .views import *

urlpatterns = [
    path('guardiandetails/',guardianListCreateView.as_view(),name="guardianListCreate"),
    path('guardiandetails/<int:pk>/',guardianDetailView.as_view(),name ='guardianListDetail'),
    path('studentdetails/', StudentDetailsListCreateView.as_view(), name='studentdetails-list-create'),
    path('studentdetails/<int:pk>/', StudentDetailsDetailView.as_view(), name='studentdetails-details'),
    # path('teacherdetails/',TeacherDetailsListCreateView.as_view(), name='teacherdetails-list-create'),
    path('teacherdetails/<int:pk>/', TeacherDetailsDetailView.as_view(), name='teacherdetails-details'),
    path('classroom/<int:teacherId>/', ClassroomDetailView.as_view(), name='classroomDetail'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('classroom/', ClassroomListCreateView.as_view(), name='classroomListCreate'),
    path('api/student-summary/', StudentGradeSummary.as_view(), name='student_summary'),
    path('api/students/grade/<int:grade>/', StudentByGradeList.as_view(), name='students_by_grade'),
    path('student-summary-by-class-name/<int:grade>', StudentGradeClassSummary.as_view(), name='student_by_class_name'),
    path('roster/<int:grade>/<str:classname>/', GradeRosterAPIView.as_view(), name='grade-roster'),
]