from rest_framework import serializers
from .models import *

class guardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = guardian_details
        fields = '__all__'

class StudentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDetails
        fields = '__all__'

class TeacherDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherDetails
        fields = '__all__'
