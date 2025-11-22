from rest_framework import serializers
from .models import *

class SchoolDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolDetail
        exclude = ['isActive']

