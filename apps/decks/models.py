from django.core.validators import MaxValueValidator
from apps.users.models import User
from django.db import models
from apps.cards.models import Card

#Table representing the decks,
class Deck(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cards = models.ManyToManyField(Card, related_name="deck_cards", through="CardsOnDeck")
    description = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'name')

    def __str__(self):
        return self.name

#Intermediary table from the relationship between the cards and decks
class CardsOnDeck(models.Model):
    class Section(models.TextChoices):
        MAIN = "main", "Main Deck"
        EXTRA = "extra", "Extra Deck"
        SIDE = "side", "Side Deck"

    deck = models.ForeignKey(Deck, models.CASCADE, related_name="deck_containing_card")
    card = models.ForeignKey(Card, models.CASCADE, related_name="card_on_deck")
    card_quantity = models.IntegerField(default=1, validators=[MaxValueValidator(3)])
    section = models.CharField(
        max_length=5,
        choices=Section.choices,
        default=Section.MAIN,
    )

    class Meta:
        unique_together = ("deck", "card", "section")