from django.urls import path
from .views import *

urlpatterns = [
    #used - gives and updates the settings data realted to school
    path('schooldetail/',SchoolDetailListCreateView.as_view(),name = "School Detail"),
    path('academic-cycle/', AcademicCycleConfigView.as_view(), name='academic-cycle-config'),
]