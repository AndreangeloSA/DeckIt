from rest_framework import serializers
from apps.users.models import AbstractUser

class RegisterSerializer(serializers.ModelSerializer):

    # expects username, email and password to create user object
    class Meta:
        model = AbstractUser
        fields = ["username", "email", "password"]

    # creates user based on those 3 parameters, receives validade data from view
    def create(self, validated_data):
        return AbstractUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"])
