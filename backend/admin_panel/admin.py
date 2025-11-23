from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(AdminProfile)
admin.site.register(TeacherDetail)
admin.site.register(StudentDetail)
admin.site.register(GuardianDetail)
admin.site.register(Classroom)
admin.site.register(StaffNIC)
admin.site.register(ClassSubjectAssignment)