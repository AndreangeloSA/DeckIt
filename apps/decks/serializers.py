from rest_framework import serializers

from apps.cards.models import Card
from apps.decks.models import Deck, CardsOnDeck

class DeckCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = CardsOnDeck
        fields = ["card", "card_quantity", "section"]

class DeckSerializer(serializers.ModelSerializer):

    card = DeckCardSerializer(
        source="deck_containing_card",
        many=True,
        read_only=True,
    )

    class Meta:
        model = Deck
        fields = "__all__"
        read_only_fields = ["id", "user"]

    def create(self, validated_data):
        return Deck.objects.create(**validated_data)

class CardQuantitySerializer(serializers.Serializer):

    deck = serializers.PrimaryKeyRelatedField(
        queryset=Deck.objects.all()
    )
    card = serializers.PrimaryKeyRelatedField(
        queryset=Card.objects.all()
    )
    card_quantity = serializers.IntegerField(
        min_value=1,
        max_value=3,
        default=1,
    )

    section = serializers.ChoiceField(
        choices = CardsOnDeck.Section.choices,
    )