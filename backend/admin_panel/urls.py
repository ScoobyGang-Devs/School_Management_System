from django.urls import path
from .views import guardianDetailView,guardianListCreateView

urlpatterns = [
    path('guardiandetails/',guardianListCreateView.as_view(),name="guardianListCreate"),
    path('guardiandetails/<int:pk>/',guardianDetailView.as_view(),name ='guardianListDetail')
]