from django.urls import path

from apps.decks.views import CreateDeck, AddCards, ViewDeck

urlpatterns = [
    path('create/', CreateDeck.as_view(), name='create'),
    path('add/', AddCards.as_view(), name='add'),
    path('decks/<int:deck_id>/', ViewDeck.as_view(), name='view'),
]
