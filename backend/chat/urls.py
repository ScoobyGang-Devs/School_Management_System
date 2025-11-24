from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, UserListViewChat

router = DefaultRouter()
router.register(r'messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('', include(router.urls)),
    path('userlist-chat/', UserListViewChat.as_view(), name='user-list-view-chat'),
]