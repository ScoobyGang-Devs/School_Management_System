from django.db import models
from django.core.validators import RegexValidator

# Create your models here.

class StudentDetails(models.Model):

    phone_regex = RegexValidator(
        regex=r'^\+?\d{9,15}$',
        message="Phone number must be 9–15 digits and may start with +"
    )
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
    
