from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.db import transaction

from .models import StaffNIC

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
    

class TeacherDetailsSerializer(serializers.ModelSerializer):
    # Show NIC in GET responses but not editable
    nic_number = serializers.CharField(source='nic_number.nic_number', read_only=True)
    userId = serializers.CharField(source='owner.id', read_only=True)

    # Returned to frontend as human-readable names
    assignedClass = serializers.SerializerMethodField()
    teachingClasses = serializers.SerializerMethodField()

    # Received from frontend as strings
    assignedClass_input = serializers.CharField(write_only=True, required=False, allow_null=True)
    teachingClasses_input = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = TeacherDetail
        exclude = ['owner']  # hide owner from frontend

    # ---------- DISPLAY METHODS ----------
    def get_assignedClass(self, obj):
        return str(obj.assignedClass) if obj.assignedClass else None

    def get_teachingClasses(self, obj):
        return [str(c) for c in obj.teachingClasses.all()]

    # ---------- UPDATE / CREATE HANDLING ----------
    def update(self, instance, validated_data):
        # Handle assignedClass
        class_name = validated_data.pop('assignedClass_input', None)
        if class_name:
            grade, sub_class = class_name.split()
            instance.assignedClass = Classroom.objects.get(grade = int(grade), className = sub_class)

        # Handle teachingClasses
        teaching_names = validated_data.pop('teachingClasses_input', None)
        class_list = []

        if teaching_names is not None:

            for cls in teaching_names:
                # Example cls = "6 A"
                try:
                    grade, sub_classs = cls.split()   # splits "6 A" → ["6", "A"]
                    classroom = Classroom.objects.get(
                        grade=int(grade),
                        className=sub_classs
                    )
                    class_list.append(classroom)
                except Classroom.DoesNotExist:
                    raise serializers.ValidationError(
                        {"error": f"Classroom '{cls}' does not exist."}
                    )

        instance.teachingClasses.set(class_list)
        
        # Save normal fields
        return super().update(instance, validated_data)


class SignupSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    nic_number = serializers.CharField()
    is_teacher = serializers.BooleanField()

    class Meta:
        model = User
        fields = ('username', 'email','nic_number', 'password1', 'password2', 'is_teacher')

    def validate(self, data):
        nic_number = data['nic_number']

        if not StaffNIC.objects.filter(nic_number=nic_number, is_used=False).exists():
            raise serializers.ValidationError("You are not a Teacher or NIC already used.")
        
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        return data

    @transaction.atomic
    def create(self, validated_data):
        
        nic_entry = StaffNIC.objects.get(nic_number=validated_data['nic_number'])
        
        if validated_data['is_teacher']:

            user = User.objects.create_user(username=validated_data['username'],
                                            email=validated_data['email'],
                                            password=validated_data['password1'])
            
            teacher = TeacherDetail.objects.create(owner = user,
                                                   nic_number = nic_entry,
                                                   email=validated_data['email'])
            
            nic_entry.is_used = True
            nic_entry.save()

        else:
            user = User.objects.create_user(username=validated_data['username'],
                                            email=validated_data['email'],
                                            password=validated_data['password1'],
                                            is_staff = True)
            
            admin = AdminProfile.objects.create(owner = user,
                                                nic_number = nic_entry,
                                                email=validated_data['email'])
            
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
        elif hasattr(obj, "admin_profile"):
            return str(obj.admin_profile)
        else:
            return obj.get_username()
    
    def get_email(self, obj):
        if hasattr(obj, "teacher_profile"):
            return obj.teacher_profile.email
        elif hasattr(obj, "admin_profile"):
            return obj.admin_profile.email
        else:
            return obj.email
    
    def get_status(self, obj):
        return "Active" if obj.is_active else "Inactive"
    
    def get_role(self, obj):
        if obj.is_superuser:
            return "Super Admin"
        elif obj.is_staff:
            return obj.admin_profile.position
        else:
            return "Teacher"
        

class AdminDetailsSerializer(serializers.ModelSerializer):
    # Show NIC in GET responses but not editable
    nic_number = serializers.CharField(source='nic_number.nic_number', read_only=True)
    userId = serializers.CharField(source='owner.id', read_only=True)

    class Meta:
        model = AdminProfile
        exclude = ['owner']  # hide owner from frontend

    # ---------- UPDATE / CREATE HANDLING ----------
    def update(self, instance, validated_data):
        # Save normal fields
        return super().update(instance, validated_data)