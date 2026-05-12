from django.db import models

class Card(models.Model):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    atk = models.IntegerField()
    defense = models.IntegerField()
    desc = models.CharField(max_length=500)
    race = models.CharField(max_length=100)
    level = models.CharField(max_length=100)

    def __str__(self):
        return self.name
