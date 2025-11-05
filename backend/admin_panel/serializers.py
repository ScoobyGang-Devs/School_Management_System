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
        fields = '__all__'
