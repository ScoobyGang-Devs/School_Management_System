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

    # permission_classes = [IsAuthenticated]

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
                    studentID=student,
                    subject=subject,
                    term__termName=term
                ).first()

                subject_list.append({
                    "subject_id": subject.subjectID,
                    "subject_name": subject.subjectName,
                    "mark": mark_obj.marksObtained if mark_obj else None
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
            f"{grade} {classname} students' results": response_data
        }, status=status.HTTP_200_OK)

class StudentGradeAverageView(APIView):

    def get(self, request, grade, term):

        students = StudentDetail.objects.filter(enrolledClass__grade = grade)
        subjects = Subject.objects.all()
        std_count = students.count()
        sub_count = subjects.count()

        average = []

        for student in students:
            student_average = []
            for subject in subjects:
                mark_object = SubjectwiseMark.objects.filter(
                    subject = subject,
                    StudentID = student,
                    term__termName=term
                ).first()

                student_average.append(mark_object.marksObtained if mark_object else 0)

            average.append(round(sum(student_average) / sub_count, 2))

        return Response({f"grade {grade}" : sum(average)/std_count}, status=status.HTTP_200_OK)        







        