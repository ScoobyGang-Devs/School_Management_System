from django.urls import path
from .views import *

urlpatterns = [
    path('studentattendence/',studentAttenenceListCreateView.as_view(),name = "studentAtendenceListCreate"),
    path('studentattendence/<int:pk>',studentAttendenceDetailView.as_view(),name = 'studentAttendenceDetailsView'),
    path('teacherattendence/',teacherAttenenceListCreateView.as_view(),name = 'teacherAttendenceListCreate'),
    path('teacherattendence/<int:pk>',teacherAttendenceDetailView.as_view(),name = "teacherAttendenceDetailsView")
]