from django.db import models
from django.core.exceptions import ValidationError
from PIL import Image
import os

def validatePNG(value):
    try:
        # Open the uploaded file
        img = Image.open(value)

        # Check the image format
        if img.format != "PNG":
            raise ValidationError("Only PNG images are allowed for the principal's signature.")

    except Exception:
        raise ValidationError("Invalid image file.")

# Create your models here.
class SchoolDetail(models.Model):
    schoolName = models.CharField(max_length=100,blank=True)
    motto = models.TextField()
    principalName = models.CharField(max_length=100,blank=True)
    principlSignature = models.ImageField(upload_to='signatures/', validators=[validatePNG])

    isActive = models.BooleanField(default=True)  # Only one principal active

    def save(self, *args, **kwargs):

        # BEFORE saving: if this principal is active → deactivate others
        if self.isActive:
            other_principals = SchoolDetail.objects.exclude(pk=self.pk).filter(isActive=True)
            for p in other_principals:
                if p.principlSignature and os.path.exists(p.principlSignature.path):
                    os.remove(p.principlSignature.path)
                p.isActive = False
                p.principlSignature = None
                p.save()

        # Now save the new principal
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.schoolName} - Principal: {self.principalName}"