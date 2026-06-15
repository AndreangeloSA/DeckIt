from rest_framework import serializers
from apps.users.models import User

class RegisterSerializer(serializers.ModelSerializer):

    # expects username, email and password to create user object
    class Meta:
        model = User
        fields = ["username", "email", "password"]

    # creates user based on those 3 parameters, receives validade data from view
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"])
