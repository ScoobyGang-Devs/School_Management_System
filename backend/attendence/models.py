from django.db import models
from admin_panel.models import *

# Create your models here.

attendence_choice = (
    ("P","Present"),
    ("A","Absent")
)
class teacherAttendence(models.Model):
    attendence_id = models.AutoField(primary_key=True)
    teacher_id = models.ForeignKey(TeacherDetail,on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=7,choices=attendence_choice,)

    def __str__(self):
        return self.attendence_id

# class studentAttendence(models.Model):
#     attendenceId = models.AutoField(primary_key=True)
#     studentId = models.ForeignKey(StudentDetail,on_delete=models.CASCADE)
#     date = models.DateField()
#     status = models.CharField(max_length=1,choices=attendence_choice,)

#     def __str__(self):
#         return f"{self.studentId} : {self.date} : {self.status}"

class studentAttendence(models.Model):
    attendenceId = models.AutoField(primary_key=True)
    className = models.ForeignKey(Classroom,
                                  on_delete=models.CASCADE,
                                  related_name='student_attendence',
                                  )
    date = models.DateField()
    isMarked = models.BooleanField(default=False)
    presentPercentage = models.DecimalField(max_digits=5, decimal_places=2)
    absentList = models.JSONField(null=True, blank=True, default=list)

    class Meta:
        unique_together = ('className', 'date')
        
    def __str__(self):
        return f"{self.className} : {self.date}"