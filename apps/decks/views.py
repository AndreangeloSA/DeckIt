from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.decks.models import Deck, CardsOnDeck
from apps.decks.serializers import DeckSerializer, CardQuantitySerializer

#Creates new deck
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

#Delete deck
class DeckDelete(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, deck_id):
        deck = get_object_or_404(
            Deck,
            id = deck_id)

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        deck.delete()
        return Response(status=status.HTTP_200_OK)

#Adds card to users decks, checks for ownership
class ManageCards(APIView):
    permission_classes = (IsAuthenticated,)


    #validates what cards can be placed into the specific deck type
    def deck_type_card_validation(self, card, section):
        allowed_extra_deck_types = {
            "Fusion Monster",
            "Link Monster",
            "Pendulum Effect Fusion Monster",
            "Synchro Monster",
            "Synchro Pendulum Effect Monster",
            "Synchro Tuner Monster",
            "XYZ Monster",
            "XYZ Pendulum Effect Monster",
        }

        is_extra_card = card.type in allowed_extra_deck_types

        if section == CardsOnDeck.Section.EXTRA:
            return is_extra_card

        if section == CardsOnDeck.Section.MAIN:
            return not is_extra_card

        if section == CardsOnDeck.Section.SIDE:
            return True

        return False

    def validate_section_capacity(self, deck, section, quantity_to_add):
        limits = {
            CardsOnDeck.Section.MAIN: 60,
            CardsOnDeck.Section.EXTRA: 15,
            CardsOnDeck.Section.SIDE: 15,
        }

        limit = limits.get(section)

        if limit is None:
            return False

        current_quantity = (
                CardsOnDeck.objects
                .filter(deck=deck, section=section)
                .aggregate(total=Sum("card_quantity"))["total"]
                or 0
        )

        return current_quantity + quantity_to_add <= limit

    def validate_card_quantity_across_section(self, deck, card, quantity_to_add):

        total_card_copies = (
            CardsOnDeck.objects
            .filter(deck=deck, card=card)
            .aggregate(total=Sum("card_quantity"))["total"]
            or 0
        )

        return total_card_copies + quantity_to_add <= 3

    #adds copies of a card and creates new card if non-existent
    def post(self, request):

        serializer = CardQuantitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deck = serializer.validated_data['deck']
        card = serializer.validated_data['card']
        quantity = serializer.validated_data['card_quantity']
        section = serializer.validated_data['section']

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        validation = self.deck_type_card_validation(card, section)

        if validation:
            if not self.validate_section_capacity(deck, section, quantity):
                return Response(
                    {"error": "Invalid section or section card limit exceeded"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not self.validate_card_quantity_across_section(deck, card, quantity):
                return Response(
                    {"error": "Total card quantity across sections exceeded"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            card_on_deck, created = CardsOnDeck.objects.get_or_create(
                deck=deck,
                card=card,
                section=section,
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
                        status.HTTP_200_OK
                    )
                )

            return Response(
                {"card_quantity": card_on_deck.card_quantity},
                status=(
                    status.HTTP_201_CREATED
                )
            )

        return Response(
            {"error": "Cannot add this type of card "},
            status=status.HTTP_400_BAD_REQUEST, )

    #deletes copies of a card and deletes the card if number reaches 0
    def delete(self, request):

        serializer = CardQuantitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deck = serializer.validated_data['deck']
        card = serializer.validated_data['card']
        quantity = serializer.validated_data['card_quantity']
        section = serializer.validated_data['section']

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        card_on_deck = get_object_or_404(
            CardsOnDeck,
            deck=deck,
            card=card,
            section=section,
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

        deck = get_object_or_404(
            Deck,
            id=deck_id,
        )

        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = DeckSerializer(deck)

        deck_total_card_quantity = (
            CardsOnDeck.objects
            .filter(deck=deck)
            .aggregate(total=Sum("card_quantity"))["total"]
            or 0
        )

        main_deck_total_card_quantity = (
                CardsOnDeck.objects
                .filter(deck=deck, section=CardsOnDeck.Section.MAIN)
                .aggregate(total=Sum("card_quantity"))["total"]
                or 0
        )

        extra_deck_total_card_quantity = (
                CardsOnDeck.objects
                .filter(deck=deck, section=CardsOnDeck.Section.EXTRA)
                .aggregate(total=Sum("card_quantity"))["total"]
                or 0
        )

        side_deck_total_card_quantity = (
                CardsOnDeck.objects
                .filter(deck=deck, section=CardsOnDeck.Section.SIDE)
                .aggregate(total=Sum("card_quantity"))["total"]
                or 0
        )

        deck_info = dict(serializer.data)
        deck_info["total_card_quantity"] = deck_total_card_quantity
        deck_info["main_total_card_quantity"] = main_deck_total_card_quantity
        deck_info["extra_total_card_quantity"] = extra_deck_total_card_quantity
        deck_info["side_total_card_quantity"] = side_deck_total_card_quantity

        return Response(deck_info, status=status.HTTP_200_OK)

#returns a list of decks
class DeckList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        deck_list = Deck.objects.filter(user=request.user)
        serializer = DeckSerializer(deck_list, many=True)

        data = {
            "deck_quantity": deck_list.count(),
            "decks": serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)

#Edit deck name and description
class EditDeck(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request, deck_id):

        deck = get_object_or_404(
            Deck,
            id=deck_id,
        )
        if deck.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = DeckSerializer(
            deck,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)