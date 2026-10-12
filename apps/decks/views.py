from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.decks.models import Deck, CardsOnDeck
from apps.decks.serializers import DeckSerializer, CardQuantitySerializer
from rest_framework.permissions import IsAuthenticated

class CreateDeck(APIView):

    #Checks auth of user
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
class AlterCardQuantity(APIView):
    permission_classes = (IsAuthenticated,)

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
                    {"error": "O limite é de 3 cópias por carta."},
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

        if quantity > card_on_deck.card_quantity:
            return Response(
                {"error": "Quantidade maior que a existente no deck."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_quantity = card_on_deck.card_quantity - quantity

        if new_quantity == 0:
            card_on_deck.delete()
        else:
            card_on_deck.card_quantity = new_quantity
            card_on_deck.save(update_fields=["card_quantity"])

        return Response(
            {"card_quantity": new_quantity},
            status=status.HTTP_200_OK,
        )



class ViewDeck(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, deck_id):

        deck = get_object_or_404(Deck, user=request.user, id=deck_id)
        serializer = DeckSerializer(deck)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeckList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        deck_list = Deck.objects.filter(user=request.user)
        serializer = DeckSerializer(deck_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)













