from django.urls import path

from apps.users.serializers import RegisterSerializer

urlpatterns = [
    path('register/', RegisterSerializer),
]