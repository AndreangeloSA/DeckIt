from django.test import TestCase
from rest_framework import status

class TestUserRegister(TestCase):

    def setUp(self):
        self.data = {
            "username": "user",
            "email": "test@email.com",
            "password": "1234",
        }

        self.data2 = {
            "username": "user",
            "email": "test2@email.com",
            "password": "12345",
        }

        self.data3 = {
            "username": "user2",
            "email": "test@email.com",
            "password": "1234"
        }

        self.data4 = {
            "username": "user",
            "email": "test@email.com",
            "password": "1111",
        }

    def test_user_register(self):

        response = self.client.post("/api/users/register/", self.data)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_user_register_duplicate_username(self):

        self.client.post("/api/users/register/", self.data)
        response = self.client.post("/api/users/register/", self.data2)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_user_register_duplicate_email(self):

        self.client.post("/api/users/register/", self.data)
        response = self.client.post("/api/users/register/", self.data3)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_user_register_login(self):

        self.client.post("/api/users//register/", self.data)
        response = self.client.post("/api/users/token/", self.data)
        response2 = self.client.post("/api/users/token/refresh/", self.data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response2.status_code,
            status.HTTP_200_OK
        )

    def test_user_register_login(self):

        self.client.post("/api/users/register/", self.data)
        response = self.client.post("/api/users/token/", self.data4)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )