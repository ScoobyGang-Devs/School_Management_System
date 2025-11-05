from django.urls import path
from .views import guardianDetailView,guardianListCreateView,StudentDetailsListCreateView,StudentDetailsDetailView

urlpatterns = [
    path('guardiandetails/',guardianListCreateView.as_view(),name="guardianListCreate"),
    path('guardiandetails/<int:pk>/',guardianDetailView.as_view(),name ='guardianListDetail'),
    path('studentdetails/', StudentDetailsListCreateView.as_view(), name='studentdetails-list-create'),
    path('studentdetails/<int:pk>/', StudentDetailsDetailView.as_view(), name='studentdetails-details'),
]