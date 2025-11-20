from django.shortcuts import get_object_or_404, render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from admin_panel.models import StudentDetail
from rest_framework.response import Response


# Create your views here.

class studentAttenenceListCreateView(generics.ListCreateAPIView):
    queryset = studentAttendence.objects.all()
    serializer_class = studentAttendenceSerializer


class studentAttendenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = studentAttendence.objects.all()
    serializer_class = studentAttendenceSerializer


class teacherAttenenceListCreateView(generics.ListCreateAPIView):
    queryset = teacherAttendence.objects.all()
    serializer_class = teacherAttendenceSerializer


class teacherAttendenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = teacherAttendence.objects.all()
    serializer_class = teacherAttendenceSerializer


class attendenceOfStudentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, indexNumber, date):
        student = get_object_or_404(StudentDetail, indexNumber=indexNumber)
        attendence = studentAttendence.objects.filter(
            studentId = student.indexNumber,
            date = date
        ).first()

        return Response({
            "studentId" : student.indexNumber,
            "studentName" : student.fullName,
            "date" : date,
            "status" : attendence.status
            })


class BulkStudentAttendanceCreate(APIView):

    def post(self, request, *args, **kwargs):

        data_list = request.data 

        # Expecting a LIST of attendance objects
        if not isinstance(data_list, list):
            return Response({
                "error" : "Request must be a non-empty list of student records"
            }, status=status.HTTP_400_BAD_REQUEST)

        class_name = data_list[0].get("className") 
        date = data_list[0].get("date") 
        
        grade = class_name.split()[0]
        className = class_name.split()[1]

        try:
            classroom = Classroom.objects.get(grade=int(grade), className=className)
        except Classroom.DoesNotExist:
            return Response({"error": "Class not found"}, status=400)

        # ---- Process student statuses ----
        total = len(data_list)
        absent = [s["indexNumber"] for s in data_list if s["status"] == "absent"]
        present_count = total - len(absent)
        present_percentage = (present_count / total) * 100
        
        # ---- Create attendance record ----
        serializer = studentAttendenceSerializer(data={
            "className": classroom.id,
            "date": date,
            "isMarked": True,
            "presentPercentage": present_percentage,
            "absentList": absent
        })
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # results = []
            # errors = []

            # for index, item in enumerate(request.data):

            #     serializer = studentAttendenceSerializer(data=item)
            #     if serializer.is_valid():
            #         serializer.save()
            #         results.append(serializer.data)
            #     else:
            #         errors.append({
            #             "row": index,        # which item failed
            #             "errors": serializer.errors
            #         })

            # # If some items have errors → 207 Multi-Status
            # if errors:
            #     return Response(
            #         {
            #             "created": results,   # valid records saved
            #             "errors": errors      # invalid rows
            #         },
            #         status=status.HTTP_207_MULTI_STATUS
            #     )

            # # All records valid
            # return Response(
            #     results,
            #     status=status.HTTP_201_CREATED
            # )
