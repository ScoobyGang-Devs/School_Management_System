from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(TeacherDetail)
admin.site.register(StudentDetail)
admin.site.register(GuardianDetail)
admin.site.register(Classroom)