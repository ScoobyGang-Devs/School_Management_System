from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import update_last_login


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


# --- Forgot Password | Request reset password ---
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

User = get_user_model()

class ForgotPasswordSerializer(serializers.Serializer):

    """
    at this point we are not sending real password reset mails. for the development perposes I decided to print the mail in the terminal, 
    which is running the backend server. it has /uid/token/ in the url. follow that url and enter those uid, token and new passwords to
    reset your password
    --------> USE THIS UNTIL WE FIND AN EASIER METHOD <---------
    """

    email = serializers.EmailField()

    # validate email using existing profiles
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No account found with this email.")
        return value

    def save(self):
        request = self.context["request"]
        email = self.validated_data["email"]
        user = User.objects.get(email=email)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)

        # ---- USE THIS OF FRONTEND HAS ANOTHER DOMAIN {NOT THE SAME BACKEND DOMAIN}
        # frontend_url = "https://frontend.com"
        # reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

        reset_link = f"{request.build_absolute_uri('/reset-password/')}{uid}/{token}/"

        # Send email
        user.email_user(
            subject="Password Reset",
            message=f"Click the link to reset your password:\n{reset_link}",
        )


# --- Reset Password Serializer ---
class ResetPasswordSerializer(serializers.Serializer):

    """
    save the new password after validating the uid, token and the pw and confirm pw
    """

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def save(self):
        uid = urlsafe_base64_decode(self.validated_data["uid"]).decode()
        user = User.objects.get(pk=uid)

        token = self.validated_data["token"]
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("Invalid or expired token.")

        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
    

# ----- Update last login manually Since we are using JWT for authentication -----
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Update last_login manually
        update_last_login(None, self.user)
        return data
    