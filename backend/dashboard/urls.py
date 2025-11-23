from django.urls import path
from .views import AdminDashboardView


urlpatterns = [
    # used?  - gives the admin dashboard related data
    path('admin_dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),

    # --> teacher_dashboard ...
]
