from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.decks.models import Deck
from apps.decks.serializers import DeckSerializer
from apps.decks.serializers import AddCardSerializer
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

        if deck_id:
            if Deck.objects.filter(id=deck_id).exists():
                deck = Deck.objects.get(id=deck_id)
                if request.user == deck.user:
                    serializer = DeckSerializer(deck)
                    return Response(serializer.data, status=status.HTTP_200_OK)

                else: return Response(status=status.HTTP_403_FORBIDDEN)

            else: return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_400_BAD_REQUEST)









