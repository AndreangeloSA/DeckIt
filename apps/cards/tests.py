from rest_framework.test import APITestCase
from rest_framework import status

from apps.cards.models import Card

class CardSearchTests(APITestCase):

    def setUp(self):
        self.card = Card.objects.create(
            id = 1,
            name='Dark Magician',
            type="monster",
            desc="The ultimate wizard in terms of attack and defense.",
            race = "Spellcaster",
            atk = 2500,
            defense = 2100
        )
        self.card2 = Card.objects.create(
            id = 2,
            name='Blue Eyes White Dragon',
            type="monster",
            desc="A powerful dragon",
            race ="Dragon",
            atk = 3000,
            defense = 2500
        )

    def test_search_cards_by_name_returns_only_matching_card(self):

        response = self.client.get("/api/cards/search/", {"name": "Dark Magician"})
        data = response.json()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(data["count"],1)
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["name"], self.card.name)

    def test_search_cards_with_no_matches(self):
        response = self.client.get("/api/cards/search/", {"name": "Exodia"})
        data = response.json()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(data["count"], 0)
        self.assertEqual(data["results"], [])

    def test_search_cards_by_partial_matches(self):
        response = self.client.get("/api/cards/search/", {"name" : "Blue"})
        data = response.json()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertGreater(len(data["results"]), 0)

        for card in data["results"]:
            self.assertIn("Blue", card["name"])

    def test_search_cards_by_parameter_range(self):
        response = self.client.get("/api/cards/search/", {"atk_min": 2000, "atk_max": 2800})
        data = response.json()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        for card in data["results"]:
            self.assertIn("Dark", card["name"])

        self.assertEqual(len(data["results"]), 1)