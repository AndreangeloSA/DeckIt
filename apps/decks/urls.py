from django.urls import path

from apps.decks.views import CreateDeck, AddCards

urlpatterns = [
    path('create/', CreateDeck.as_view(), name='create'),
    path('add/', AddCards.as_view(), name='add'),
]
