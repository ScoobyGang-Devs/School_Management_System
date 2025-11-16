from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

# Create your views here.

class TermTestListCreateView(generics.ListCreateAPIView):
    queryset = TermTest.objects.all()
    serializer_class = TermTestSerializer


class TermTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TermTest.objects.all()
    serializer_class = TermTestSerializer

class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectwiseMarkListCreateView(generics.ListCreateAPIView):
    queryset = SubjectwiseMark.objects.all()
    serializer_class = SubjectwiseMarkSerializer

class SubjectwiseMarkListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubjectwiseMark.objects.all()
    serializer_class = SubjectwiseMarkSerializer

class GradeClassWiseResultsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, grade, classname, term):
        
        students = StudentDetail.objects.filter(
            enrolledClass__grade=grade,
            enrolledClass__className=classname
        )

        subjects = Subject.objects.all()

        response_data = []

        for student in students:
            subject_list = []
            for subject in subjects:
                mark_obj = SubjectwiseMark.objects.filter(
                    Student_ID=student,
                    Subject_ID=subject,
                    Term_id=term
                ).first()

                subject_list.append({
                    "subject_id": subject.Subject_ID,
                    "subject_name": subject.Subject_name,
                    "mark": mark_obj.Marks_Obtained if mark_obj else None
                })

            response_data.append({
                "student_id": student.indexNumber,
                "student_name": student.fullName,
                # "grade": student.,
                # "class_room": student.class_room,
                "subjects": subject_list
            })

        return Response({
            # "term": term,
            # "grade": grade,
            # "classname": classname,
            "students": response_data
        }, status=status.HTTP_200_OK)
        