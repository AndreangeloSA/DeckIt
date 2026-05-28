from django.urls import path

from .views import CardSearchView

urlpatterns = [
    path('search/', CardSearchView.as_view()),
]