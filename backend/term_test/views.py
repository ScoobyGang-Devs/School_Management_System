from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
# from django.shortcuts import get_object_or_404

from django.db.models import Avg, Count, Sum, F # Import necessary aggregation functions
from django.db.models.functions import Coalesce 

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

# REMOVED cuz we created views to handle GET/POST separately 
# class SubjectwiseMarkListCreateView(generics.ListCreateAPIView):
#     queryset = SubjectwiseMark.objects.all()
#     serializer_class = SubjectwiseMarkSerializer

# use this for handle [PUT/PATCH/DELETE] requests
class SubjectwiseMarkListDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubjectwiseMark.objects.all()
    serializer_class = SubjectwiseMarkSerializer
    lookup_field = "subjectWiseMarkID"               # The model field that should be used for performing object lookup of individual model instances. Defaults to 'pk'

# view subject wise results of students using class and term [GET]
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
                "subjects": subject_list
            })

        return Response(
            {f"{grade} {classname} students' results": response_data}, 
            status=status.HTTP_200_OK
            )
    
# this view is for bluk create subjectwise marks [POST]
class SubjectWiseMarksBulkCreateView(generics.CreateAPIView):
    queryset = SubjectwiseMark.objects.all()
    serializer_class = SubjectwiseMarkSerializer

    def create(self, request, *args, **kwargs):

        # If request data is a LIST → Bulk create
        if isinstance(request.data, list):
            results = []
            errors = []
            
            for index, item in enumerate(request.data):
                serializer = self.get_serializer(data=item)
                if serializer.is_valid():
                    serializer.save()
                    results.append(serializer.data)
                else:
                    errors.append({"row": index, "errors": serializer.errors})

            if errors:
                return Response(
                    {"created": results, "errors": errors},
                    status=status.HTTP_207_MULTI_STATUS
                )

            return Response(results, status=status.HTTP_201_CREATED)

        # single create
        return super().create(request, *args, **kwargs)
        

#the page rendering took a very long time while using this view , so the new view below was used 
#the new view uses uses sokme built in functions like Avg , Annotate and agregate which sped up the rendering time
# class StudentGradeAverageView(APIView):

#     def get(self, request, grade, term):

#         students = StudentDetail.objects.filter(enrolledClass__grade = grade)
#         subjects = Subject.objects.all()
#         std_count = students.count()
#         sub_count = subjects.count()

#         average = []

#         for student in students:
#             student_average = []
#             for subject in subjects:
#                 mark_object = SubjectwiseMark.objects.filter(
#                     subject = subject,
#                     studentID = student,
#                     term__termName=term
#                 ).first()

#                 student_average.append(mark_object.marksObtained if mark_object else 0)

#             average.append(round(sum(student_average) / sub_count, 2))

#         return Response({f"grade {grade}" : sum(average)/std_count}, status=status.HTTP_200_OK)        

       

class StudentGradeAverageView(APIView):

    def get(self, request, grade, term):
        
        # 1. Filter SubjectwiseMark objects for the given grade and term
        #    The double underscore lookup traverses the FK relationships efficiently.
        average_queryset = SubjectwiseMark.objects.filter(
            studentID__enrolledClass__grade=grade,
            term__termName=term
        )

        # 2. Group by student and calculate the average mark for each student.
        #    Coalesce is used to ensure marksObtained is treated as a float (DecimalField) before averaging.
        student_averages = average_queryset.values('studentID').annotate(
            student_avg_mark=Avg('marksObtained')
        )

        # 3. Calculate the average of all those student averages.
        #    This gives the overall grade average in a single database operation.
        final_average = student_averages.aggregate(
            overall_grade_avg=Avg('student_avg_mark')
        )['overall_grade_avg'] # Extract the aggregated value

        # Handle case where no marks exist (final_average would be None)
        if final_average is None:
            final_average = 0.0
        
        # Format the result to two decimal places
        final_average = round(final_average, 2)


        return Response({f"grade {grade}" : final_average}, status=status.HTTP_200_OK)

class StudentClassAverageView(APIView):
    """
    Calculates the overall average mark for all students in a specific class and term.
    Uses efficient Django Aggregation to avoid N+1 queries.
    """
    def get(self, request, grade, classname, term):
        
        # 1. Filter SubjectwiseMark objects for the given grade, class, and term
        average_queryset = SubjectwiseMark.objects.filter(
            # Filter by grade and class name through the student's enrolledClass FK
            studentID__enrolledClass__grade=grade,
            studentID__enrolledClass__className=classname,
            # Filter by the TermName
            term__termName=term
        )

        # 2. Group by student and calculate the average mark for each student.
        #    This generates a temporary table of individual student averages.
        student_averages = average_queryset.values('studentID').annotate(
            student_avg_mark=Avg('marksObtained')
        )

        # 3. Calculate the average of all those student averages. (Overall Class Average)
        final_average = student_averages.aggregate(
            overall_class_avg=Avg('student_avg_mark')
        )['overall_class_avg']

        # Handle case where no marks exist
        if final_average is None:
            final_average = 0.0
        
        # Format the result to two decimal places
        final_average = round(final_average, 2)

        # Returns the class average in a simple format (e.g., {"6 B": 75.45})
        return Response({f"{grade} {classname}": final_average}, status=status.HTTP_200_OK)






        
