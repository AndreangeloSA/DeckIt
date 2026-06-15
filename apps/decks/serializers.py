from rest_framework import serializers
from apps.cards.models import Card
from apps.decks.models import Deck, CardsOnDeck


class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = "__all__"

    def create(self, validated_data):
        return Deck.objects.create(**validated_data)

class AddCardSerializer(serializers.Serializer):
    class Meta:
        model = Card
        fields = ["id", "card_quantity"]

    def create(self, validated_data):
        return CardsOnDeck.objects.create(**validated_data)