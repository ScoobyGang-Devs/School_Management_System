from django import forms
from django.contrib import admin
from .models import Message

class MessageAdminForm(forms.ModelForm):
    receivers_text = forms.CharField(
        label="Receivers (comma-separated teacher IDs)",
        help_text='Enter teacher IDs separated by commas',
        required=True
    )

    class Meta:
        model = Message
        fields = "__all__"

    def save(self, commit=True):
        instance = super().save(commit=False)
        ids = [tid.strip() for tid in self.cleaned_data["receivers_text"].split(",")]
        instance.recipients = ids
        instance.read_status = {tid: False for tid in ids}
        if commit:
            instance.save()
        return instance


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    form = MessageAdminForm
    list_display = ("subject", "sender_name", "category", "urgent", "timestamp", "recipient_count", "unread_count")
    list_filter = ("category", "urgent", "timestamp")
    search_fields = ("subject", "content", "sender_teacher__fullName")
    readonly_fields = ("read_status", "timestamp")

    # Custom method to display sender name
    def sender_name(self, obj):
        return obj.sender_teacher.fullName
    sender_name.short_description = "Sender"

    def recipient_count(self, obj):
        return len(obj.recipients) if obj.recipients else 0
    recipient_count.short_description = "Recipients"

    def unread_count(self, obj):
        return sum(1 for read in obj.read_status.values() if not read) if obj.read_status else 0
    unread_count.short_description = "Unread"
