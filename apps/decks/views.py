from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.decks.models import Deck
from serializers import DeckSerializer
from serializers import AddCardSerializer
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

class AddCards(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = AddCardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class ViewDeck(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        deck_id = request.query_params.get('id')
        deck_name = request.query_params.get('name')

        if deck_name:
            deck = Deck.objects.get(id = deck_id)
            serializer = DeckSerializer(deck)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif deck_name:
            deck = Deck.objects.get(name = deck_name)
            serializer = DeckSerializer(deck)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else : return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)








