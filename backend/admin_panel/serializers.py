from rest_framework import serializers
from .models import guardian_details

class guardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = guardian_details
        fields = '__all__'