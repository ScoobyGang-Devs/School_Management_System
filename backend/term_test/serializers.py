from rest_framework import serializers
from .models import TermTest, Subject
from admin_panel.models import StudentDetail

class StudentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDetail
        fields = ['indexNumber', 'firstName', 'lastName'] 

class TermTestSerializer(serializers.ModelSerializer):
    student = StudentDetailsSerializer(read_only=True)

    class Meta:
        model = TermTest
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
