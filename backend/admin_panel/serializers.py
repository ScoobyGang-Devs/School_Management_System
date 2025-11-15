from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

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

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials.")
    
        
