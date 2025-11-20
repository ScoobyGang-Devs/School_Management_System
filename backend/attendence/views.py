from django.shortcuts import get_object_or_404, render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from admin_panel.models import StudentDetail
from rest_framework.response import Response
from django.utils import timezone
import datetime


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

        # Expecting a LIST of attendance objects
        if isinstance(request.data, list):

            results = []
            errors = []

            for index, item in enumerate(request.data):

                serializer = studentAttendenceSerializer(data=item)
                if serializer.is_valid():
                    serializer.save()
                    results.append(serializer.data)
                else:
                    errors.append({
                        "row": index,        # which item failed
                        "errors": serializer.errors
                    })

            # If some items have errors → 207 Multi-Status
            if errors:
                return Response(
                    {
                        "created": results,   # valid records saved
                        "errors": errors      # invalid rows
                    },
                    status=status.HTTP_207_MULTI_STATUS
                )

            # All records valid
            return Response(
                results,
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"error": "Request must contain a list of attendance objects"},
            status=status.HTTP_400_BAD_REQUEST
        )


class PresentAbsentDataView(APIView):

    def get(self, request, classname, grade):

        today = timezone.now().date()
        attendance_today = studentAttendence.objects.filter(
            date=today,
            className__className = classname,
            className__grade = grade
        )
        attendance_class = studentAttendence.objects.filter(
            className__className = classname,
            className__grade = grade
        )
        response_list = []

        try:
            if attendance_today:

                attendence_data = attendance_class.order_by('-date')[1:6]
                

                for dataset in attendence_data:
                    data = {}
                    data["date"] = dataset.date
                    data["present average"] = dataset.presentPercentage
                    data["absentees"] = dataset.absentList
                    response_list.append(data)

            else:
                attendence_data = attendance_class.order_by('-date')[0:5]

                for dataset in attendence_data:
                    data = {}
                    data["date"] = dataset.date
                    data["present average"] = dataset.presentPercentage
                    data["absentees"] = dataset.absentList
                    response_list.append(data)


        except IndexError:
            if attendance_class:

                for dataset_ in attendance_class:
                    data_ = {}
                    data_["date"] = dataset_.date
                    data_["present average"] = dataset_.presentPercentage
                    data_["absentees"] = dataset_.absentList
                    response_list.append(data_)

        return Response({"class" : f"{grade} {classname}",
                         "absent list" : response_list}, status=status.HTTP_201_CREATED)            


                    
















