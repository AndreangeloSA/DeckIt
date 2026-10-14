from django.urls import path

from apps.decks.views import CreateDeck, ViewDeck, ManageCards, DeckList

urlpatterns = [
    path('create/', CreateDeck.as_view(), name='create'),
    path('manage_cards/', ManageCards.as_view(), name='manage_cards'),
    path('decks/<int:deck_id>/', ViewDeck.as_view(), name='view'),
    path('decklist/', DeckList.as_view(), name='decklist'),
]
