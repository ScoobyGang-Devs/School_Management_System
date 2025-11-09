from django.urls import path
from .views import *

urlpatterns = [
    path('guardiandetails/',guardianListCreateView.as_view(),name="guardianListCreate"),
    path('guardiandetails/<int:pk>/',guardianDetailView.as_view(),name ='guardianListDetail'),
    path('studentdetails/', StudentDetailsListCreateView.as_view(), name='studentdetails-list-create'),
    path('studentdetails/<int:pk>/', StudentDetailsDetailView.as_view(), name='studentdetails-details'),
    path('teacherdetails/',TeacherDetailsListCreateView.as_view(), name='teacherdetails-list-create'),
    path('teacherdetails/<int:pk>/', TeacherDetailsDetailView.as_view(), name='teacherdetails-details'),
    path('classroom/<int:teacherId>/', ClassroomDetailView.as_view(), name='classroomDetail'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('api/signup/', signup_api, name='signup_api'),
    path('api/login/', login_api, name='login_api'),
]