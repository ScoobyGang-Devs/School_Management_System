from django import forms
from django.contrib import admin
from .models import Message

class MessageAdminForm(forms.ModelForm):
    receivers_text = forms.CharField(
        label="Receivers (comma-separated emails)",
        help_text='Enter emails separated by commas',
        required=True
    )

    class Meta:
        model = Message
        fields = "__all__"

    def save(self, commit=True):
        instance = super().save(commit=False)
        emails = [email.strip() for email in self.cleaned_data["receivers_text"].split(",")]
        instance.receivers = emails
        instance.read_status = {email: False for email in emails}
        if commit:
            instance.save()
        return instance

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    form = MessageAdminForm
    list_display = ("subject", "sender", "category", "urgent", "timestamp", "recipient_count", "unread_count")
    list_filter = ("category", "urgent", "timestamp")
    search_fields = ("subject", "content", "sender", "sender_email")
    readonly_fields = ("read_status", "timestamp")

    def recipient_count(self, obj):
        return len(obj.receivers) if obj.receivers else 0
    recipient_count.short_description = "Recipients"

    def unread_count(self, obj):
        return sum(1 for read in obj.read_status.values() if not read) if obj.read_status else 0
    unread_count.short_description = "Unread"
