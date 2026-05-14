from django.db import models

class Card(models.Model):

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    frametype = models.CharField(max_length=50, null=True)
    desc = models.CharField(max_length=500)
    atk = models.IntegerField(null=True)
    defense = models.IntegerField(null=True)
    level = models.IntegerField(null=True)
    race = models.CharField(max_length=50)
    attribute = models.CharField(max_length=50)

    def __str__(self):
        return self.name
