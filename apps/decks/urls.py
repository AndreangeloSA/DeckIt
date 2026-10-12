from django.urls import path

from apps.decks.views import CreateDeck, ViewDeck, AlterCardQuantity, DeckList

urlpatterns = [
    path('create/', CreateDeck.as_view(), name='create'),
    path('alter_card_qtd/', AlterCardQuantity.as_view(), name='alter_card_qtd'),
    path('decks/<int:deck_id>/', ViewDeck.as_view(), name='view'),
    path('decklist/', DeckList.as_view(), name='decklist'),
]
