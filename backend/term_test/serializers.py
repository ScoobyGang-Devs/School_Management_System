from rest_framework import serializers
from .models import *
from admin_panel.models import *

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

class SubjectwiseMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectwiseMark
        fields = '__all__'