from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

# Create your models here.

phone_regex = RegexValidator(
        regex=r'^\+?\d{9,15}$',
        message="Phone number must be 9–15 digits and may start with +"
    )

class Classroom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    grade = models.IntegerField()

    def __str__(self):
        return self.name

class TeacherNIC(models.Model):
    nic_number = models.CharField(max_length=25, unique=True, blank=False, null=False)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return self.nic_number
    
class GuardianDetail(models.Model):

    GUARDIAN = [
        ('M',"Mother"),
        ('F',"Father"),
        ('G',"Guardian")
    ]

    guardianId = models.AutoField(primary_key=True, unique=True)
    guardianNic = models.CharField(unique=True)
    guardianName = models.CharField(max_length=100000)
    guardianType = models.CharField(max_length=1,choices=GUARDIAN,blank=True)
    guardianEmail = models.EmailField(unique=True)
    permanentAddress = models.TextField()
    currentAddress = models.TextField()
    guardianContactNumber = models.CharField(validators=[phone_regex],max_length=16)
    alternativeContactNumber = models.CharField(validators=[phone_regex],max_length=16)
    jobTitle = models.CharField(max_length=100000)

    def __str__(self):
        return self.guardianName

class StudentDetail(models.Model):

    GENDER = {
        'M':'Male',
        'F':'Female'
    }

    indexNumber = models.IntegerField(primary_key=True,unique=True)
    guardian = models.ForeignKey(GuardianDetail, on_delete=models.CASCADE, related_name='students')
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    surName = models.CharField(max_length=100)
    fullName = models.CharField(max_length=300)
    dateOfBirth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER, blank=False)
    email = models.EmailField(max_length=254)
    address = models.TextField()
    enrollmentDate = models.DateField()
    mobileNumber = models.CharField(validators=[phone_regex], max_length=16)
    enrolledClass = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, related_name='students')

    def __str__(self):
        return f"{self.firstName} {self.lastName}"
    

class TeacherDetail(models.Model):

    GENDER = {
        'M':'Male',
        'F':'Female'
    }

    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )

    teacherId = models.AutoField(primary_key=True, blank=False, unique=True)
    nic_number = models.OneToOneField(TeacherNIC, on_delete=models.PROTECT)
    firstName = models.CharField(max_length=100, null=True, blank=True)
    lastName = models.CharField(max_length=100, null=True, blank=True)
    surName = models.CharField(max_length=100, null=True, blank=True)
    fullName = models.CharField(max_length=300, null=True, blank=True)
    dateOfBirth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER, blank=False, null=True)
    email = models.EmailField(max_length=254, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    enrollmentDate = models.DateField(null=True, blank=True)
    mobileNumber = models.CharField(validators=[phone_regex], max_length=16, null=True, blank=True)
    section = models.CharField(max_length=300, null=True, blank=True)
    assignedClass = models.OneToOneField(Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name='teachers')

    def __str__(self):
        return f"{self.firstName} {self.lastName}"

