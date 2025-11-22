from django.urls import path
from .views import aview

# remove these after u add somthing to dashboard app
###############
urlpatterns = [
    path('', aview.as_view(), name='a-view')
]
################