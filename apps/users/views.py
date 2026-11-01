from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from apps.cards.models import Card
from apps.cards.serializers import CardSerializer
from apps.users.models import FavoriteCards
from apps.users.serializers import RegisterSerializer, FavoriteCardsSerializer

class RegisterView(APIView):

    def post(self, request):
        registerSerializer = RegisterSerializer(data=request.data)

        if registerSerializer.is_valid():
            registerSerializer.save()
            return Response(
                registerSerializer.data, status=status.HTTP_201_CREATED)

        return Response(
            registerSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class Favorite(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, card_id):

        card = get_object_or_404(Card, id=card_id)
        serializer = FavoriteCardsSerializer(data={"card": card.id})

        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, card_id):

        card = get_object_or_404(
            FavoriteCards,
            card=card_id,
            user=request.user,
        )
        card.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request):

        favorite_list = FavoriteCards.objects.filter(user=request.user)
        serializer = FavoriteCardsSerializer(favorite_list, many=True)

        data = {
            "cards": serializer.data,
            "favorite_card_count": favorite_list.count(),
        }

        return Response(data, status=status.HTTP_200_OK)