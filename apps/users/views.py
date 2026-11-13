import sib_api_v3_sdk
from django.contrib.auth.password_validation import validate_password
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes, force_str
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from sib_api_v3_sdk.rest import ApiException
from apps.cards.models import Card
from apps.users.models import FavoriteCards, User
from apps.users.serializers import RegisterSerializer, FavoriteCardsSerializer
from config.settings import frontend_url, BREVO_API_KEY
from django.core.exceptions import ValidationError

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

class UserGeneralInfo(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        user = get_object_or_404(User, id=request.user.id)
        email = user.objects.get(email=request.user.email)
        date_joined = user.objects.get(date_joined = request.user.date_joined)

        data = {
            "email": email,
            "date_joined": date_joined
        }

        return data

def send_password_reset_email(user, reset_link):

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        sender={
            "name": "DeckIt",
            "email": "deckit.support@gmail.com"
        },
        to=[
            {"email": user.email}
        ],
        subject="Password Reset",
        text_content=(
            "You have requested a password reset.\n\n"
            f"Access this link to proceed: {reset_link}\n\n"
            "If you have not requested a password reset, "
            "please ignore this email."
        )
    )

    try:
        response = api_instance.send_transac_email(email)
    except ApiException as error:
        raise

class PasswordResetRequest(APIView):

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email__iexact=email).first()

        if user is not None:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"{frontend_url}/reset-password.html"f"?uid={uid}&token={token}"
            send_password_reset_email(user, reset_link)

        return Response(status.HTTP_200_OK)

class PasswordReset(APIView):

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)

        try:
            validate_password(new_password, user)
        except ValidationError as error:
            return Response(
                {"errors": error.messages},
                status=status.HTTP_400_BAD_REQUEST
            )

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password successfully reset"}, status.HTTP_200_OK)
        return Response({"error": "invalid token"}, status.HTTP_403_FORBIDDEN)

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

        deck_section = request.query_params.get("deck_section")
        favorite_list = FavoriteCards.objects.filter(user=request.user)

        if deck_section:
            favorite_list = deck_section_selector_favorites(deck_section=deck_section, favorite_list=favorite_list)

        serializer = FavoriteCardsSerializer(favorite_list, many=True)

        data = {
            "cards": serializer.data,
            "favorite_card_count": favorite_list.count(),
        }

        return Response(data, status=status.HTTP_200_OK)

def deck_section_selector_favorites(deck_section, favorite_list):

    allowed_extra_deck_types = {
        "Fusion Monster",
        "Fusion Toon Effect Monster",
        "Link Monster",
        "Pendulum Effect Fusion Monster",
        "Synchro Monster",
        "Synchro Pendulum Effect Monster",
        "Synchro Tuner Monster",
        "XYZ Monster",
        "XYZ Pendulum Effect Monster",
    }

    if deck_section == "extra":
        return favorite_list.filter(card__type__in=allowed_extra_deck_types)

    elif deck_section == "main":
        return favorite_list.exclude(card__type__in=allowed_extra_deck_types)

    else:
        return favorite_list