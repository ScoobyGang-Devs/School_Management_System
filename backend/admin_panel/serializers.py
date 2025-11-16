from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.db import transaction

class guardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuardianDetail
        fields = '__all__'
        
class StudentDetailsSerializer(serializers.ModelSerializer):
    
    guardian = guardianSerializer()   


    class Meta:
        model = StudentDetail
        fields = '__all__'

    def create(self, validated_data):
        guardian_data = validated_data.pop('guardian')

        guardian_email = guardian_data.get('guardianEmail')
        guardian_id = guardian_data.get('guardianId')

        guardian = None

        if guardian_id and GuardianDetail.objects.filter(guardianId=guardian_id).exists():
            guardian = GuardianDetail.objects.get(guardianId=guardian_id)

        elif guardian_email and GuardianDetail.objects.filter(guardianEmail=guardian_email).exists():
            guardian = GuardianDetail.objects.get(guardianEmail=guardian_email)

        else:
            guardian = GuardianDetail.objects.create(**guardian_data)

        student = StudentDetail.objects.create(guardian=guardian, **validated_data)
        return student

class TeacherDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherDetail
        exclude = ['assignedClass', 'teacherId']

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'

class SignupSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    nic_number = serializers.CharField()

    class Meta:
        model = User
        fields = ('username', 'email','nic_number', 'password1', 'password2')

    def validate(self, data):
        nic_number = data['nic_number']

        if not TeacherNIC.objects.filter(nic_number=nic_number, is_used=False).exists():
            raise serializers.ValidationError("You are not a Teacher or NIC already used.")
        
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        return data

    @transaction.atomic
    def create(self, validated_data):

        nic_entry = TeacherNIC.objects.get(nic_number=validated_data['nic_number'])
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        TeacherDetail.objects.create(
            owner = user,
            nic_number=nic_entry
        )
        nic_entry.is_used = True
        nic_entry.save()
        
        return user
    


class StudentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDetail
        fields = '__all__'
