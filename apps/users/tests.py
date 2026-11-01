from rest_framework import status
from rest_framework.test import APITestCase

from apps.cards.models import Card
from apps.users.models import User, FavoriteCards

class TestUserRegister(APITestCase):

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
            "password": "123456"
        }

        self.data4 = {
            "username": "user",
            "email": "test@email.com",
            "password": "1111",
        }

        self.user = User.objects.create_user(username='test', email='testfavorite@email.com', password='1234')

        self.card = Card.objects.create(
            id=46986414,
            name="Dark Magician",
            type="Normal Monster",
            desc="The ultimate wizard in terms of attack and defense.",
            race="Spellcaster",
        )

        self.favorite_data = {
            "user": self.user,
            "id": 46986414
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

        self.client.post("/api/users/register/", self.data)
        register_response = self.client.post("/api/users/token/", self.data)
        login_response = self.client.post("/api/users/token/refresh/", {"refresh":register_response.data["refresh"]})

        self.assertEqual(
            register_response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            login_response.status_code,
            status.HTTP_200_OK
        )

    def test_user_register_login_wrong_password(self):

        self.client.post("/api/users/register/", self.data)
        response = self.client.post("/api/users/token/", self.data4)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_add_card_favorite(self):

        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"/api/users/favorite/{self.favorite_data['id']}/", self.favorite_data)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            FavoriteCards.objects.filter(user=self.user).count(),
            1
        )

    def test_remove_card_favorite(self):

        self.client.force_authenticate(user=self.user)
        post_response = self.client.post(f"/api/users/favorite/{self.favorite_data['id']}/", self.favorite_data)
        response = self.client.delete(f"/api/users/favorite/{self.favorite_data['id']}/", self.favorite_data)

        self.assertEqual(
            post_response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        self.assertEqual(
            FavoriteCards.objects.filter(user=self.user).count(),
            0
        )

    def test_get_favorite_card_list(self):

        self.client.force_authenticate(user=self.user)

        post_response = self.client.post(f"/api/users/favorite/{self.favorite_data['id']}/", self.favorite_data)

        self.assertEqual(
            post_response.status_code,
            status.HTTP_201_CREATED
        )

        response = self.client.get(f"/api/users/favorite/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            FavoriteCards.objects.filter(user=self.user).count(),
            1
        )