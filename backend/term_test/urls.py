from django.urls import path
from .views import *

urlpatterns = [
    path('term-tests/', TermTestListCreateView.as_view(), name='termtest-list-create'),
    path('term-tests/<int:pk>/', TermTestDetailView.as_view(), name='termtest-detail'),
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),
    path('subjectwise-marks/', SubjectwiseMarkListCreateView.as_view(), name='subjectwise-mark-list'),
    path('subjectwise-marks/<int:pk>/', SubjectwiseMarkListDetailView.as_view(), name='subjectwise-mark-detail'),
    path('marks/<int:grade>/<str:classname>/<int:term>/', GradeClassWiseResultsView.as_view(), name='subjectwise-marks-filtered-by-class'),
    path('average/grade/<int:grade>/term/<int:term>' , StudentGradeAverageView.as_view(), name='average-grade-mark'),

]
