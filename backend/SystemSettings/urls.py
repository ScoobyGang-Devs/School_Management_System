from django.urls import path
from .views import *

urlpatterns = [
    path('schooldetail/',SchoolDetailListCreateView.as_view(),name = "School Detail")
]