from django.db import models
from admin_panel.models import *

# Create your models here.

class TermTest(models.Model):

    TERM_CHOICES = [
        ('Term 1', 'Term 1'),
        ('Term 2', 'Term 2'),
        ('Term 3', 'Term 3'),
    ]

    PASS_FAIL_CHOICES = [
        ('Pass', 'Pass'),
        ('Fail', 'Fail'),
    ]

    term_summary_id = models.BigAutoField(primary_key=True)
    student = models.ForeignKey(StudentDetail, on_delete=models.CASCADE)
    term = models.CharField(max_length=10, choices=TERM_CHOICES)
    total_marks = models.DecimalField(max_digits=6, decimal_places=2)
    average_mark = models.DecimalField(max_digits=5, decimal_places=2)
    rank = models.IntegerField()
    pass_fail_status = models.CharField(max_length=10 ,choices=PASS_FAIL_CHOICES)


    def __str__(self):
        return f"{self.student.firstName} {self.student.lastName} - {self.term}"
    
class Subject(models.Model):
    Subject_ID = models.AutoField(primary_key=True)
    Subject = models.CharField(max_length=100)

    def __str__(self):
        return self.Subject
    
class SubjectwiseMark(models.Model):
    subjectwise_Mark_ID=models.BigAutoField(primary_key=True)
    Student_ID = models.ForeignKey(
        StudentDetail,
        on_delete=models.CASCADE,
        related_name='subject_marks'
    )

    Subject_ID = models.ForeignKey(
        Subjects,
        on_delete=models.CASCADE,
        related_name='subject_marks'
    )

    Mark_Type_ID = models.ForeignKey(
        MarkType,
        on_delete=models.CASCADE,
        related_name='mark_type_marks'
    )

    Term = models.CharField(max_length=10)

    Marks_Obtained = models.DecimalField(max_digits=5, decimal_places=2)
    Max_Marks = models.DecimalField(max_digits=5, decimal_places=2)

    Teacher_ID = models.ForeignKey(
        TeacherDetail,
        on_delete=models.SET_NULL,
        null=True,
        related_name='teacher_marks'
    )

    Date_Recorded = models.DateField()

    def __str__(self):
        return f"{self.Student_ID.name} - {self.Subject_ID.subject_name} - {self.Term}"

