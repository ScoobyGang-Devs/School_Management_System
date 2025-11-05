from django.db import models
from django.core.validators import RegexValidator

# Create your models here.

phone_regex = RegexValidator(
        regex=r'^\+?\d{9,15}$',
        message="Phone number must be 9–15 digits and may start with +"
    )

class guardian_details(models.Model):

    GUARDIAN = [
        ('M',"Mother"),
        ('F',"Father"),
        ('G',"Guardian")
    ]


    guardian_id = models.IntegerField(primary_key=True, unique=True)
    guardian_name = models.CharField(max_length=100000)
    guardian_type = models.CharField(max_length=1,choices=GUARDIAN,blank=True)
    guardian_email = models.EmailField(unique=True)
    permanent_address = models.TextField()
    current_address = models.TextField()
    guar_con_number = models.CharField(validators=[phone_regex],max_length=16)
    alternative_con_number = models.CharField(validators=[phone_regex],max_length=16)
    job_title = models.CharField(max_length=100000)

    def __str__(self):
        return self.guardian_name

class StudentDetails(models.Model):

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
    

class TeacherDetails(models.Model):

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





