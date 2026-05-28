from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from apps.users.serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):

    def post(self, request):
        registerSerializer = RegisterSerializer(data=request.data)

        if registerSerializer.is_valid():
            registerSerializer.save()
            return Response(
                registerSerializer.data, status=status.HTTP_201_CREATED)

        return Response(
            registerSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
