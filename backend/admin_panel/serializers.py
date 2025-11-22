from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.db import transaction

from .models import TeacherNIC

class guardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuardianDetail
        fields = '__all__'
        extra_kwargs = {
            'guardianNIC': {'validators': []},
            'guardianEmail': {'validators': []},
        }


class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'


class StudentDetailsSerializer(serializers.ModelSerializer):
    guardian = serializers.PrimaryKeyRelatedField(queryset=GuardianDetail.objects.all())

    # enrolledClassDisplay = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentDetail
        fields = '__all__'

    # def create(self, validated_data):
    #     guardian_data = validated_data.pop('guardian')

    #     guardian, created = GuardianDetail.objects.get_or_create(
    #         guardianNIC=guardian_data['guardianNIC'],
    #         defaults=guardian_data
    #     )

    #     # If guardian exists and data has updates → update fields
    #     if not created:
    #         for field, value in guardian_data.items():
    #             setattr(guardian, field, value)
    #         guardian.save()

    #     student = StudentDetail.objects.create(
    #         guardian=guardian,
    #         **validated_data
    #     )

    #     return student
    
    # def get_enrolledClassDisplay(self, obj):
    #     if obj.enrolledClass:
    #         return f"{obj.enrolledClass.grade} {obj.enrolledClass.className}"
    #     return None

    def to_representation(self, instance):
        """
        We override this to format data for the frontend (GET requests).
        This keeps the Class Display logic simple and separate from writing.
        """
        # 1. Get the standard data (includes 'guardian' object and 'enrolledClass' ID)
        data = super().to_representation(instance)

        from .serializers import guardianSerializer 
        data['guardian'] = guardianSerializer(instance.guardian).data

        # 2. Add the readable Class Name string
        #    The frontend can now use: student.enrolledClass_str -> "6 A"
        if instance.enrolledClass:
            data['enrolledClass_str'] = f"{instance.enrolledClass.grade} {instance.enrolledClass.className}"
        else:
            data['enrolledClass_str'] = "Unassigned"

        return data
    
    # def update(self, instance, validated_data):
    #     """
    #     Handle updates (PATCH/PUT requests).
    #     We separate the guardian data from the student data and update them individually.
    #     """

    #     # this code was added becasue without a specifically made update method ... the default patch method causes an error 
        
        
    #     # 1. Extract guardian data if it exists in the request
    #     guardian_data = validated_data.pop('guardian', None)

    #     # 2. Update the Student fields
    #     # when the fronend sends data in the form ... it contains data that is changed and non changed data too...
    #     #we loop through all of these and update the data in the database ... reardless of whether they are changed or not

    #     # fact - put --> changed and unchaged data /// patch --> chagned data only ... 
    #     for attr, value in validated_data.items():
    #         #this changes the python object of the database
    #         setattr(instance, attr, value)
    #     #instance.save() is where the DB data is ACTUALLY changed!
    #     instance.save()

    #     # 3. Update the Guardian fields (only if data was sent)
    #     #if the gaurdian data is changed then changing the gaurdian data is done i this code snippet
    #     if guardian_data and instance.guardian:
    #         guardian = instance.guardian
    #         for attr, value in guardian_data.items():
    #             setattr(guardian, attr, value)
    #         guardian.save()

    #     return instance


class TeacherDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherDetail
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
        teacher = TeacherDetail.objects.create(
            owner = user,
            nic_number=nic_entry
        )
        nic_entry.is_used = True
        nic_entry.save()
        
        return user


class StudentDetailSerializer(serializers.ModelSerializer):
    enrolledClass = serializers.ModelSerializer(StudentDetailsSerializer,StudentDetail.enrolledClass)

    class Meta:
        model = StudentDetail
        fields = '__all__'


class teachersClassViewSerializer(serializers.Serializer):
    teacherId = serializers.IntegerField()


class UserListSerializer(serializers.ModelSerializer):

    
    status = serializers.SerializerMethodField()    # a read-only field whose value comes from a method on the serializer rather than a model field
    role = serializers.SerializerMethodField()
    userName = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userName', 'email', 'role', 'status', 'last_login']

    def get_userName(self, obj):
        if hasattr(obj, "teacher_profile"):
            return str(obj.teacher_profile)
        return obj.get_full_name()
    
    def get_email(self, obj):
        if hasattr(obj, "teacher_profile"):
            return obj.teacher_profile.email
        return "Null"
    
    def get_status(self, obj):
        return "Active" if obj.is_active else "Inactive"
    
    def get_role(self, obj):
        if obj.is_superuser:
            return "Admin"
        elif obj.is_staff:
            return "Staff"
        else:
            return "Teacher"
        

