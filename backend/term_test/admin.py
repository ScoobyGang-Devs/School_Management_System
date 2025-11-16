from django.contrib import admin
from .models import TermTest, Subject, SubjectwiseMark

# Register your models here.

admin.site.register(TermTest)
admin.site.register(Subject)
admin.site.register(SubjectwiseMark)