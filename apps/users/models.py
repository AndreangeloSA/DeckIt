from django.db import models
from django.contrib.auth.models import AbstractUser

from apps.cards.models import Card

class User(AbstractUser):
    email = models.EmailField(unique=True, default="")

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

class FavoriteCards(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "card")