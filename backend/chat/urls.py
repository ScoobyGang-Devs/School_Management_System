from django.urls import path
from .views import MessageViewSet, UserListViewChat

urlpatterns = [
    
    path('messages/inbox/', MessageViewSet.as_view({'get': 'inbox'}), name='messages-inbox'),

    
    path('messages/sent/', MessageViewSet.as_view({'get': 'sent'}), name='messages-sent'),

    
    path('messages/send/', MessageViewSet.as_view({'post': 'send_message'}), name='messages-send'),


    path('messages/mark-as-read/', MessageViewSet.as_view({'patch': 'mark_as_read'}), name='messages-mark-read'),
    

    path('userlist-chat/', UserListViewChat.as_view(), name='user-list-view-chat'),
]
