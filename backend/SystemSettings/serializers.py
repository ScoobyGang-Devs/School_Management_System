from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password
from .models import AcademicCycleConfig
from term_test.models import *


class SchoolDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolDetail
        exclude = ['isActive']


class AcademicCycleConfigSerializer(serializers.ModelSerializer):
    current_term_display = serializers.CharField(source='current_term.get_termName_display', read_only=True)

    class Meta:
        model = AcademicCycleConfig
        fields = ['academic_year', 'current_term', 'current_term_display']