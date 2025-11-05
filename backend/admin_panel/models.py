from django.db import models
from django.core.validators import RegexValidator

# Create your models here.

phone_regex = RegexValidator(
        regex=r'^\+?\d{9,15}$',
        message="Phone number must be 9–15 digits and may start with +"
    )

class GuardianDetail(models.Model):

    GUARDIAN = [
        ('M',"Mother"),
        ('F',"Father"),
        ('G',"Guardian")
    ]


    guardianId = models.IntegerField(primary_key=True, unique=True)
    guardianName = models.CharField(max_length=100000)
    guardianType = models.CharField(max_length=1,choices=GUARDIAN,blank=True)
    guardianEmail = models.EmailField(unique=True)
    permanentAddress = models.TextField()
    currentAddress = models.TextField()
    guardianContactNumber = models.CharField(validators=[phone_regex],max_length=16)
    alternativeContactNumber = models.CharField(validators=[phone_regex],max_length=16)
    jobTitle = models.CharField(max_length=100000)

    def __str__(self):
        return self.guardian_name

class StudentDetail(models.Model):

    GENDER = {
        'M':'Male',
        'F':'Female'
    }

    indexNumber = models.IntegerField(primary_key=True,unique=True)
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

    def __str__(self):
        return f"{self.firstName} {self.lastName}"
    

class TeacherDetail(models.Model):

    GENDER = {
        'M':'Male',
        'F':'Female'
    }

    nic_number = models.IntegerField(unique=True)
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
    section = models.CharField(max_length=300)
    assignedClass = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"





