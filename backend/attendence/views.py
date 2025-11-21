from django.shortcuts import get_object_or_404, render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from admin_panel.models import *
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

        data_list = request.data 

        # Expecting a LIST of attendance objects
        if not isinstance(data_list, list):
            return Response({
                "error" : "Request must be a non-empty list of student records"
            }, status=status.HTTP_400_BAD_REQUEST)

        class_name = data_list[0].get("className") 
        date = data_list[0].get("date")
        
        grade = class_name.split()[0]
        class_letter = class_name.split()[1]

        try:
            classroom = Classroom.objects.get(grade=int(grade), className=class_letter)
        except Classroom.DoesNotExist:
            return Response({"error": "Class not found"}, status=400)

        # ---- Process student statuses ----
        total = len(data_list) - 1
        absent = [s["indexNumber"] for s in data_list[1::] if s["status"] == "absent"]
        present_count = total - len(absent)
        present_percentage = round(((present_count / total) * 100), 2)
        
        # ---- Create attendance record ----
        serializer = studentAttendenceSerializer(data={
            "className": f"{grade} {class_letter}",
            "date": date,
            "isMarked": True,
            "presentPercentage": present_percentage,
            "absentList": absent
        })
        
        if serializer.is_valid():
            serializer.save()
            return Response({"Created": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


                    
















