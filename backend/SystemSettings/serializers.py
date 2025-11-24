from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password
from .models import AcademicCycleConfig
from term_test.models import *


class SchoolDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolDetail
        exclude = ['isActive']

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({'current_password': 'Incorrect current password.'})
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        validate_password(data['new_password'], user)
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()

class AcademicCycleConfigSerializer(serializers.ModelSerializer):
    current_term_display = serializers.CharField(source='current_term.get_termName_display', read_only=True)

    class Meta:
        model = AcademicCycleConfig
        fields = ['academic_year', 'current_term', 'current_term_display']