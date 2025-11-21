from rest_framework import serializers
from .models import *
from admin_panel.models import *
from django.db import transaction

#DRY
class StudentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDetail
        fields = ['indexNumber', 'fullName'] 

class TermTestSerializer(serializers.ModelSerializer):
    student = StudentDetailsSerializer(read_only=True)

    class Meta:
        model = TermTest
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['subjectID', 'subjectName']

class SubjectwiseMarkSerializer(serializers.ModelSerializer):

    subject = SubjectSerializer(read_only=True)                 # nested subject data
    subjectName = serializers.CharField(write_only=True)        # accept subject name in POST

    class Meta:
        model = SubjectwiseMark
        fields = [
            'subjectWiseMarkID',
            'subject',
            'subjectName',
            'studentID',
            'term',
            'marksObtained',
            'teacherID',
            'dateRecorded'
        ]
        read_only_fields = ['subjectWiseMarkID', 'dateRecorded']
    
    def validate(self, data):

        subjectName = data.get("subjectName")
        student = data.get("studentID")
        term = data.get("term")
        marksObtained = data.get("marksObtained")

        # validate marks
        if not 0 <= marksObtained <= 100 :
            raise serializers.ValidationError({"error" : "Invalid Marks"})
        
        # validate subject
        try :
            subjectObj = Subject.objects.get(subjectName=subjectName)
        except Subject.DoesNotExist:
            raise serializers.ValidationError({"error" : "Subject doesn't exist"})

        # validate uniqueness
        if SubjectwiseMark.objects.filter(
            studentID = student,
            subject = subjectObj,
            term = term
            ).exists() :
            
            raise serializers.ValidationError({"error" : "This student, term, subject data is already exists"})
        
        return data

    @transaction.atomic
    def create(self, validated_data):

        subjectName = validated_data.pop("subjectName")
        subjectObj = Subject.objects.get(subjectName=subjectName)

        return SubjectwiseMark.objects.create(
            subject=subjectObj,
            **validated_data
        )