from django.urls import path
from .views import *

urlpatterns = [
    path('guardiandetails/',guardianListCreateView.as_view(), name="guardianListCreate"),
    path('guardiandetails/<int:pk>/',guardianDetailView.as_view(),name ='guardianListDetail'),
    path('studentdetails/', StudentDetailsListCreateView.as_view(), name='studentdetails-list-create'),
    # details of the student for student card ---- this returns a json with both student and guardian details --- we need the index of the student
    path('studentdetails/<int:pk>/', StudentDetailsDetailView.as_view(), name='studentdetails-details'), 
    #path('teacherdetails/',TeacherDetailsListCreateView.as_view(), name='teacherdetails-list-create'),
    path('teacher-profile/', TeacherDetailsDetailView.as_view(), name='teacherdetails-details'),
    path('classroom/<int:teacherId>/', ClassroomDetailView.as_view(), name='classroomDetail'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('classroom/', ClassroomListCreateView.as_view(), name='classroomListCreate'),
    path('add/students/', StudentsCreateView.as_view(), name='ad'),
    path('api/student-summary/', StudentGradeSummary.as_view(), name='student_summary'),
    path('api/students/grade/<int:grade>/', StudentByGradeList.as_view(), name='students_by_grade'),
    path('student-summary-by-class-name/<int:grade>/', StudentGradeClassSummary.as_view(), name='student_by_class_name'),
    path('roster/<int:grade>/<str:classname>/', GradeRosterAPIView.as_view(), name='grade-roster'),
    path('admin_dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('teacherclassview/', teacherClassView.as_view(), name='teacher_class_view'),
    path('user/', UserListView.as_view(), name='user-list'), # use this to view all logged in users' details
    path('teacherclassresultview/<int:grade>/<str:className>/<str:subjectName>', teacherClassResultView.as_view(),name='teacher_result_view'),
    path('teachers/all/', TeacherListView.as_view(), name='all-teachers-list'),
    path('teacherdetails/<int:teacherId>/', TeacherRetrieveView.as_view(), name='teacher-detail-by-id'),
]