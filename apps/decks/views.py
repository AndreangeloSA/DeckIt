from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.decks.models import Deck, CardsOnDeck
from apps.decks.serializers import DeckSerializer, CardQuantitySerializer

class CreateDeck(APIView):

    #Checks user authentication
    permission_classes = (IsAuthenticated,)

    #Creates deck
    def post(self, request):
        serializer = DeckSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Adds card to users decks, checks for ownership
class ManageCards(APIView):
    permission_classes = (IsAuthenticated,)

    #adds copies of a card and creates new card if non-existent
    def post(self, request):

        serializer = CardQuantitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deck = serializer.validated_data['deck']
        card = serializer.validated_data['card']
        quantity = serializer.validated_data['card_quantity']

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        card_on_deck, created = CardsOnDeck.objects.get_or_create(
            deck=deck,
            card=card,
            defaults={"card_quantity": quantity},
        )

        if not created:
            new_quantity = card_on_deck.card_quantity + quantity

            if new_quantity > 3:
                return Response(
                    {"error": "The limit is 3 copies of the card"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            card_on_deck.card_quantity = new_quantity
            card_on_deck.save(update_fields=["card_quantity"])

        return Response(
            {"card_quantity": card_on_deck.card_quantity},
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            ),
        )

    #deletes copies of a card and deletes the card if number reaches 0
    def delete(self, request):

        serializer = CardQuantitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deck = serializer.validated_data['deck']
        card = serializer.validated_data['card']
        quantity = serializer.validated_data['card_quantity']

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        card_on_deck = get_object_or_404(
            CardsOnDeck,
            deck=deck,
            card=card,
        )

        if quantity >= card_on_deck.card_quantity:
            new_quantity = 0
        else:
            new_quantity = card_on_deck.card_quantity - quantity

        if new_quantity == 0:
            card_on_deck.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            card_on_deck.card_quantity = new_quantity
            card_on_deck.save(update_fields=["card_quantity"])

        return Response(
            {"card_quantity": new_quantity},
            status=status.HTTP_200_OK,
        )

#returns a deck
class ViewDeck(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, deck_id):

        deck = Deck.objects.get(id=deck_id)

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = DeckSerializer(deck)

        return Response(serializer.data, status=status.HTTP_200_OK)

#returns a list of decks
class DeckList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        deck_list = Deck.objects.filter(user=request.user)
        serializer = DeckSerializer(deck_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
