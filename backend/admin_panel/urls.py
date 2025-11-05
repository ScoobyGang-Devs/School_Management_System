from django.urls import path
from .views import StudentDetailsListCreateView,StudentDetailsDetailView

urlpatterns = [
    path('studentdetails/', StudentDetailsListCreateView.as_view(), name='studentdetails-list-create'),
    path('studentdetails/<int:pk>/', StudentDetailsDetailView.as_view(), name='studentdetails-details'),
]