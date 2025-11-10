from django.db import models
from admin_panel.models import StudentDetail

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