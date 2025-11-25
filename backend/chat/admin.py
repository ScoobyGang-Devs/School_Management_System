# chat/admin.py
from django import forms
from django.contrib import admin
from .models import Message


class MessageAdminForm(forms.ModelForm):
    receivers_text = forms.CharField(
        label="Receivers (comma-separated user IDs)",
        help_text="Example: 1, 2, 3   — OR type ALL",
        required=True
    )

    class Meta:
        model = Message
        fields = "__all__"

    def save(self, commit=True):
        instance = super().save(commit=False)

        raw = self.cleaned_data["receivers_text"].strip()

       
        if raw.upper() == "ALL":
            instance.recipients = ["ALL"]
            instance.read_status = {}    
        else:
            
            ids = [int(x.strip()) for x in raw.split(",") if x.strip()]
            instance.recipients = ids
            instance.read_status = {str(x): False for x in ids}

        if commit:
            instance.save()
        return instance


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    form = MessageAdminForm

    list_display = (
        "subject", "get_sender_name", "category", "urgent",
        "timestamp", "recipient_count", "unread_count"
    )

    readonly_fields = ("timestamp", "read_status")
    list_filter = ("category", "urgent", "timestamp")
    search_fields = ("subject", "content", "sender__username")

    def get_sender_name(self, obj):
        user = obj.sender
        if user is None:
            return ""

        if hasattr(user, "teacher_profile"):
            return user.teacher_profile.nameWithInitials
        if hasattr(user, "admin_profile"):
            return user.admin_profile.nameWithInitials

        return user.username

    def recipient_count(self, obj):
        if obj.recipients == ["ALL"]:
            return "ALL"
        return len(obj.recipients)

    def unread_count(self, obj):
        return sum(1 for read in obj.read_status.values() if not read)
