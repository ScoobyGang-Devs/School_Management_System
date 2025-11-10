from django.urls import path
from .views import *

urlpatterns = [
    path('term-tests/', TermTestListCreateView.as_view(), name='termtest-list-create'),
    path('term-tests/<int:pk>/', TermTestDetailView.as_view(), name='termtest-detail'),
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),
]
