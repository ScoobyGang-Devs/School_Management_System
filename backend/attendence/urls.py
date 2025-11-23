from django.urls import path, register_converter
from .views import *

urlpatterns = [
    #list used - gives all the student attendance data
    #create not used
    path('studentattendence/', studentAttenenceListCreateView.as_view(),name = "studentAtendenceListCreate"),

    # not yet used!! - when std ID is given the relavent attendance data is given 
    path('studentattendence/<int:pk>/', studentAttendenceDetailView.as_view(),name = 'studentAttendenceDetailsView'),

    #list used - gives all the teacher attendance data
    #create not used <-- this is IMPORTANT
    path('teacherattendence/', teacherAttenenceListCreateView.as_view(),name = 'teacherAttendenceListCreate'),

    # not yet used!! - when std ID is given the relavent attendance data is given 
    path('teacherattendence/<int:pk>/', teacherAttendenceDetailView.as_view(),name = "teacherAttendenceDetailsView"),

    #not used yet - when the date and index is given this gives the relavent attendance data
    path('studentattendence/<int:indexNumber>/<str:date>/', attendenceOfStudentView.as_view(), name = "attendenceOfStudentView"),

    #not used - when the classname and grade is given it gives the total attendance datas 
    path('classattendance/<int:grade>/<str:classname>', PresentAbsentDataView.as_view()),

    # used - creating attendance in a class all at once!
    path('students/bulk-create/', BulkStudentAttendanceCreate.as_view(), name="class-attendance-mark"),

    #not used - when class grade and letter is given , this gives the relavent attendance data
    path('student-list/<int:grade>/<str:class_letter>/', StudentDetailForAttendenceView.as_view(), name='student-name-index-view-for-attendence'),
]