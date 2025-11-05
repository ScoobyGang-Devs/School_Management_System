from rest_framework import serializers
from .models import *

class studentAttendenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = studentAttendence
        fields = '__all__'

class teacherAttendenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = teacherAttendence
        fields = '__all__'