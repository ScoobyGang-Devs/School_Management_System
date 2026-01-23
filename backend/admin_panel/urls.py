from django.urls import path
from .views import *

urlpatterns = [
    #used - gives and creates the gaurdian details
    path('guardiandetails/',guardianListCreateView.as_view(), name="guardianListCreate"),

    #not used - gives details of a specific gaurdian
    path('guardiandetails/<int:pk>/',guardianDetailView.as_view(),name ='guardianListDetail'),

    #used - creates and lists students
    path('studentdetails/', StudentDetailsListCreateView.as_view(), name='studentdetails-list-create'),
    
    #  used - details of the student for student card ---- this returns a json with both student and guardian details --- we need the index of the student
    path('studentdetails/<int:pk>/', StudentDetailsDetailView.as_view(), name='studentdetails-details'), 
    
    # Teacher can edit his/her profile using this endpoint ---> can handle GET/PUT/PATCH reqests
    path('teacher-profile/', TeacherDetailsUpdateView.as_view(), name='teacher-profile-update'),

    # Admins can edit his/her profile using this endpoint ---> can handle GET/PUT/PATCH reqests
    path('admin-profile/', AdminProfileUpdateView.as_view(), name='admin-profile-update'),
    
    #used (in my classes page )- when teacher ID is sent ... this gives the classes the teacher teaches to
    path('classroom/<int:teacherId>/', ClassroomDetailView.as_view(), name='classroomDetail'),

    #used - signup
    path('signup/', SignupView.as_view(), name='signup'),

    #not used - used to create as well as list all the classes ... although the creating is still not yet done
    path('classroom/', ClassroomListCreateView.as_view(), name='classroomListCreate'),

    #used - add students
    path('add/students/', StudentsCreateView.as_view(), name='ad'),

    # used - gives the student details in a class
    path('api/student-summary/', StudentGradeSummary.as_view(), name='student_summary'),

    # used - gives the number of students by grade
    path('api/students/grade/<int:grade>/', StudentByGradeList.as_view(), name='students_by_grade'),

    # used - class name count by grade
    path('student-summary-by-class-name/<int:grade>/', StudentGradeClassSummary.as_view(), name='student_by_class_name'),

    #used - gives all the student details
    path('roster/<int:grade>/<str:classname>/', GradeRosterAPIView.as_view(), name='grade-roster'),

    #used - gives the assigned classes and teaching classes ! (used in myClasses)
    path('teacherclassview/', teacherClassView.as_view(), name='teacher_class_view'),

    #used - use this to view all logged in users' details
    path('users/', UserListView.as_view(), name='user-list'), 

    # not used ?? =     This view receives a teacherID from the frontend and returns the teacher's assigned class results.
    path('teacherclassresultview/<int:grade>/<str:className>/<str:subjectName>/', teacherClassResultView.as_view(),name='teacher_result_view'),

    #used - gives the details of all the teachers
    path('teachers/all/', TeacherListView.as_view(), name='all-teachers-list'),

    #used - when the id is given ... this gives the teacherID
    path('teacherdetails/<int:teacherId>/', TeacherRetrieveView.as_view(), name='teacher-detail-by-id'),

    # NEW: Instant count for a specific grade (Replaces the heavy list call)
    path('api/students/count/grade/<int:grade>/', SingleGradeCountView.as_view(), name='single_grade_count'),

    # NEW: Breakdown of counts by class for a specific grade
    path('api/students/count/classes/<int:grade>/', ClassCountByGradeView.as_view(), name='class_count_by_grade'),
]