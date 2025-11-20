
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

# Create your models here.

phone_regex = RegexValidator(
        regex=r'^\+?\d{9,15}$',
        message="Phone number must be 9–15 digits and may start with +"
    )

class Classroom(models.Model):
    className = models.CharField(max_length=1)
    grade = models.IntegerField()

    def __str__(self):
        return f"{self.grade} {self.className}"

class TeacherNIC(models.Model):
    nic_number = models.CharField(max_length=25, unique=True, blank=False, null=False)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return self.nic_number
    
class GuardianDetail(models.Model):

    TITLE_CHOICES = [
        ('Mr', 'Mr'),
        ('Ms', 'Ms'),
        ('Mrs', 'Mrs'),
        ('Ven', 'Ven')
    ]

    GUARDIAN = [
        ('M',"Mother"),
        ('F',"Father"),
        ('G',"Guardian")
    ]
    title = models.CharField(max_length=10, choices=TITLE_CHOICES, null=True, blank=True)
    guardianId = models.AutoField(primary_key=True, unique=True)
    guardianNIC = models.CharField(max_length=20,unique=True)
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
    nameWithInitials = models.CharField(max_length=100, null=True,blank=True)
    fullName = models.CharField(max_length=300)
    dateOfBirth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER, blank=False)
    email = models.EmailField(max_length=254)
    address = models.TextField()
    enrollmentDate = models.DateField()
    mobileNumber = models.CharField(validators=[phone_regex], max_length=16)
    enrolledClass = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, related_name='students')

    def __str__(self):
        return f"{self.fullName}"
    

class TeacherDetail(models.Model):

    GENDER = {
        'M':'Male',
        'F':'Female'
    }

    TITLE_CHOICES = [
        ('Mr', 'Mr'),
        ('Ms', 'Ms'),
        ('Mrs', 'Mrs'),
        ('Ven', 'Ven')
    ]


    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )
    teacherId = models.AutoField(primary_key=True, blank=False, unique=True)
    nic_number = models.OneToOneField(TeacherNIC, on_delete=models.PROTECT)
    title = models.CharField(max_length=10, choices=TITLE_CHOICES, null=True, blank=True)
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
    teachingClasses = models.ManyToManyField(Classroom, null=True, blank=True, related_name='subteachers')

    def __str__(self):
        return f"{self.title} {self.fullName}"
