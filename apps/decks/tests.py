from rest_framework.test import APITestCase
from apps.cards.models import Card
from apps.users.models import User
from rest_framework import status
from apps.decks.models import Deck
from apps.decks.models import CardsOnDeck

class BaseDeckTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='test', email='test@email.com',  password='1234')
        self.user2 = User.objects.create_user(username='test2', email='test2@email.com', password='1234')
        self.deck = Deck.objects.create(
            name='test deck',
            user=self.user
        )
        self.card1 = Card.objects.create(
            id=1,
            name='Dark Magician',
            type="monster",
            desc="The ultimate wizard in terms of attack and defense.",
            race="Spellcaster"
        )

        self.data = {
            'deck': self.deck.id,
            'card': self.card1.id,
            'card_quantity': 1
        }

        self.data2 = {
            'deck': self.deck.id,
            'card': self.card1.id,
            'card_quantity': 2
        }

class CreateDeckTests(BaseDeckTestCase):

    def test_create_deck_without_authentication(self):

        og_count = Deck.objects.count()
        response = self.client.post('/api/decks/create/', data={'name':'test'}, format='json')
        new_count = Deck.objects.count()

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

        self.assertEqual(
            new_count,
            og_count
        )

    def test_create_deck_with_authentication(self):
        self.client.force_authenticate(user=self.user)

        og_count = Deck.objects.count()
        response = self.client.post('/api/decks/create/', data={'name':'test'}, format='json')
        new_count = Deck.objects.count()

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            new_count,
            og_count + 1
        )

    def test_created_deck_ownership(self):

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/decks/create/', data={'name':'ownership test'}, format='json')
        deck = Deck.objects.get(name='ownership test')

        self.assertEqual(
            deck.user,
            self.user
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )


class ViewDeckAPITests(BaseDeckTestCase):

    def test_view_deck(self):

        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/api/decks/decks/{self.deck.id}/')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.json()['id'],
            self.deck.id
        )

    def test_view_deck_no_authentication(self):

        response = self.client.get(f'/api/decks/decks/{self.deck.id}/')

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_view_deck_not_owner(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.get(f'/api/decks/decks/{self.deck.id}/')

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

class ManageDeckTests(BaseDeckTestCase):

    def test_manage_decks_POST_no_authentication(self):

        data = self.data
        response = self.client.post('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_manage_decks_POST_new_card(self):

        self.client.force_authenticate(user=self.user)

        data = self.data

        response = self.client.post('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertGreater(
            response.json()['card_quantity'],
            0
        )

    def test_manage_decks_POST_add_card_copies(self):

        self.client.force_authenticate(user=self.user)

        data = self.data

        self.client.post('/api/decks/manage_cards/', data)
        response = self.client.post('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertGreater(
            response.json()['card_quantity'],
            data['card_quantity']
        )

    def test_manage_decks_POST_add_card_copies_above_limit(self):

        self.client.force_authenticate(user=self.user)

        data2 = self.data2

        self.client.post('/api/decks/manage_cards/', data2)
        response = self.client.post('/api/decks/manage_cards/', data2)
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_manage_decks_POST_add_card_not_owner(self):

        self.client.force_authenticate(user=self.user2)

        data = self.data
        response = self.client.post('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_manage_decks_DELETE_no_authentication(self):

        data = self.data

        response = self.client.delete('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_manage_decks_DELETE_no_card_found(self):

        self.client.force_authenticate(user=self.user)

        data = self.data

        response = self.client.delete('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )


    def test_manage_decks_DELETE_remove_card(self):
        self.client.force_authenticate(user=self.user)

        data = self.data

        self.client.post('/api/decks/manage_cards/', data)
        response = self.client.delete('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertFalse(
            CardsOnDeck.objects.filter(deck = self.deck, card=self.card1).exists()
        )

    def test_manage_decks_DELETE_remove_copy(self):
        self.client.force_authenticate(user=self.user)

        data = self.data
        data2 = self.data2

        self.client.post('/api/decks/manage_cards/', data2)
        card_on_deck = CardsOnDeck.objects.get(deck = self.deck, card=self.card1)
        response = self.client.delete('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.json()['card_quantity'],
            card_on_deck.card_quantity - data['card_quantity']
        )

    def test_manage_decks_DELETE_remove_card_not_owner(self):
        self.client.force_authenticate(user=self.user2)

        data = self.data
        response = self.client.delete('/api/decks/manage_cards/', data)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )