from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


# --- Change User Password ---
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user

        # Check current password
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"error": "Incorrect current password."})

        # Check password match
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Passwords do not match."})

        # Validate new password strength
        validate_password(data['new_password'], user)

        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user