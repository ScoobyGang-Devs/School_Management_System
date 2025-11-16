from django.db import models
from admin_panel.models import *

# Create your models here.

attendence_choice = (
    ("Present","Present"),
    ("Absent","Absent")
)
class teacherAttendence(models.Model):
    attendence_id = models.AutoField(primary_key=True)
    teacher_id = models.ForeignKey(TeacherDetail,on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=7,choices=attendence_choice,)

    def __str__(self):
        return self.attendence_id

class studentAttendence(models.Model):
    attendenceId = models.AutoField(primary_key=True)
    studentId = models.ForeignKey(StudentDetail,on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=7,choices=attendence_choice,)
    k = str(attendenceId)
    def __str__(self):
        return self.k

# class studentAttendence(models.Model):
#     attendenceId = models.AutoField(primary_key=True)
#     studentId = models.ForeignKey(StudentDetail, on_delete=models.CASCADE)
#     date = models.DateField()
#     status = models.CharField(max_length=7, choices=attendence_choice)

#     def __str__(self):
#         student_name = self.studentId.full_name
#         classroom = self.studentId.enrolledClass 
#         return f"{student_name} - {classroom} - {self.date} - {self.status}"