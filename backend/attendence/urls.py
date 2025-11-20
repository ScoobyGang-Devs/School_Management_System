from django.urls import path, register_converter
from .views import *

urlpatterns = [
    path('studentattendence/', studentAttenenceListCreateView.as_view(),name = "studentAtendenceListCreate"),
    path('studentattendence/<int:pk>/', studentAttendenceDetailView.as_view(),name = 'studentAttendenceDetailsView'),
    path('teacherattendence/', teacherAttenenceListCreateView.as_view(),name = 'teacherAttendenceListCreate'),
    path('teacherattendence/<int:pk>/', teacherAttendenceDetailView.as_view(),name = "teacherAttendenceDetailsView"),
    path('studentattendence/<int:indexNumber>/<str:date>/', attendenceOfStudentView.as_view(), name = "attendenceOfStudentView"),
    path('bulk/', BulkStudentAttendanceCreate.as_view()),
    path('classattendance/<str:classname>', PresentAbsentDataView.as_view())
]