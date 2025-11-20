from django.db import models
from admin_panel.models import *

# Create your models here.

class TermName(models.Model):

    TERM_CHOICES = [
        ('1', 'Term 1'),
        ('2', 'Term 2'),
        ('3', 'Term 3')
    ]

    termName = models.CharField(max_length=1, choices=TERM_CHOICES, unique=True)

    def __str__(self):
        return f"Term {self.termName}"
    

class Subject(models.Model):

    subjectID = models.AutoField(primary_key=True)
    subjectName = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.subjectName
    
    
class TermTest(models.Model):

    termtestId = models.AutoField(primary_key=True)
    student = models.ForeignKey(
        StudentDetail,
        on_delete=models.CASCADE,
        related_name='termtest'
    )
    rank = models.IntegerField(null=True, blank=True)
    term = models.ForeignKey(
        TermName, 
        on_delete=models.CASCADE,
        related_name='termtest'
    )
    total = models.IntegerField(null=True, blank=True)
    average = models.DecimalField(decimal_places=2, max_digits=6)

    def __str__(self):
        return f"Index {self.student.indexNumber} : Term {self.term.termName}"


class SubjectwiseMark(models.Model):

    subjectWiseMarkID=models.BigAutoField(primary_key=True)

    subject = models.ForeignKey(
        Subject, 
        on_delete=models.CASCADE, 
        related_name='subjectwisemark'
    )
    studentID = models.ForeignKey(
        StudentDetail,
        on_delete=models.CASCADE,
        related_name='subjectwisemark'
    )
    term = models.ForeignKey(
        TermName,
        on_delete=models.CASCADE,
        related_name='subjectwisemark'
    )

    marksObtained = models.DecimalField(max_digits=5, decimal_places=2)

    teacherID = models.ForeignKey(
        TeacherDetail,
        on_delete=models.SET_NULL,
        null=True,
        related_name='subjectwisemark'
    )

    dateRecorded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Term {self.term.termName} : {self.studentID.firstName} : {self.subject.subjectName}"