from rest_framework import serializers
from .models import *

class guardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuardianDetail
        fields = '__all__'

class StudentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDetail
        fields = '__all__'

class TeacherDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherDetail
        exclude = ['assignedClass', 'teacherId']

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'
        