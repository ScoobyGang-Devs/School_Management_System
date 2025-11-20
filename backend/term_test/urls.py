from django.urls import path
from .views import *

urlpatterns = [
    #gives a list of all term test results
    path('term-tests/', TermTestListCreateView.as_view(), name='termtest-list-create'),

    #make changes to term test records
    path('term-tests/<int:pk>/', TermTestDetailView.as_view(), name='termtest-detail'),

    #retrieves all list of subject or creates subject
    path('subjects/', SubjectListCreateView.as_view(), name='subject-list'),

    #Manages a specific Subject by its primary key (pk).
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),

    # path('subjectwise-marks/', SubjectwiseMarkListCreateView.as_view(), name='subjectwise-mark-list'),
    #Manages a specific SubjectwiseMark record by its ID (subjectWiseMarkID)
    path('subjectwise-marks/<int:pk>/', SubjectwiseMarkListDetailView.as_view(), name='subjectwise-mark-detail'),
    
    #gives term marks for a class in a certain grade
    path('marks/<int:grade>/<str:classname>/<int:term>/', GradeClassWiseResultsView.as_view(), name='subjectwise-marks-filtered-by-class'),

    #used for uploading results?
    path('subject-wise-marks/create/', SubjectWiseMarksBulkCreateView.as_view(), name='subject-wise-marks-bulk-create'),

    #gives the average result when the grade and the term is given
    path('average/grade/<int:grade>/term/<int:term>' , StudentGradeAverageView.as_view(), name='average-grade-mark'),


    #when the frontend gives the classname and the grade... this calculates the avg of each class!
    path('average/grade/<int:grade>/class/<str:classname>/term/<int:term>', 
         StudentClassAverageView.as_view(), 
         name='average-class-mark'),

]
