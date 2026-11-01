from django.urls import path

from apps.decks.views import CreateDeck, ViewDeck, ManageCards, DeckList, DeckDelete, EditDeck, CardUsageStats

urlpatterns = [
    path('create/', CreateDeck.as_view(), name='create'),
    path('delete/<int:deck_id>/', DeckDelete.as_view(), name='delete'),
    path('edit/<int:deck_id>/', EditDeck.as_view(), name='edit'),
    path('manage_cards/', ManageCards.as_view(), name='manage_cards'),
    path('decks/<int:deck_id>/', ViewDeck.as_view(), name='view'),
    path('decklist/', DeckList.as_view(), name='decklist'),
    path('card_usage_stats/', CardUsageStats.as_view(), name='card_usage_stats')
]
