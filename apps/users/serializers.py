from rest_framework import serializers
from apps.users.models import User, FavoriteCards

class RegisterSerializer(serializers.ModelSerializer):

    # expects username, email and password to create user object
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    # creates user based on those 3 parameters, receives validated data from view
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"])

class FavoriteCardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteCards
        fields = ["id", "card", "user"]
        read_only_fields = ["user", "id"]

    def create(self, validated_data):
        return FavoriteCards.objects.create(**validated_data)