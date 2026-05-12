from django.urls import path

from .views import search_card_view

urlpatterns = [

    path('search/', search_card_view)

]