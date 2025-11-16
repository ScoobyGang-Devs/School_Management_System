from django.contrib import admin
from django.contrib.auth.models import User
from .models import ChatRoom, Message

# Register your models here.

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at")
    filter_horizontal = ("teachers",)  
    search_fields = ("name",)
 


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("room", "sender", "content", "timestamp", "read")
    list_filter = ("room", "sender")
    search_fields = ("content",)

    autocomplete_fields = ("room", "sender")

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "sender":
            kwargs["queryset"] = User.objects.filter(chat_rooms__isnull=False).distinct()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)