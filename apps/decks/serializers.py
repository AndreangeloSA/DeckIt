from rest_framework import serializers
from apps.decks.models import Deck, CardsOnDeck

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ["name"]

    def create(self, validated_data):
        return Deck.objects.create(**validated_data)

class AddCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardsOnDeck
        fields = ["deck", "card", "card_quantity"]

    def create(self, validated_data):
        return CardsOnDeck.objects.create(**validated_data)