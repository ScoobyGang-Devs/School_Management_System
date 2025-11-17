from django.contrib import admin
from term_test.models import Subject, SubjectwiseMark, TermTest, TermName
# Register your models here.

admin.site.register(Subject)
admin.site.register(SubjectwiseMark)
admin.site.register(TermTest)
admin.site.register(TermName)
