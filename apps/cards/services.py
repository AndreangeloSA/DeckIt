import time

import requests
from django.core.files.base import ContentFile

from .models import Card
from rest_framework import status

BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
IMAGE_URL = "https://images.ygoprodeck.com/images/cards/"

# ONE TIME USE IMPORT, BUT COULD BE USED FOR UPDATING DATABASE PERIODICALLY
# IMPORT AFTER IMPLEMENTATION OF IMAGES HAS NOT BEEN TESTED, SEEKING TO NOT TRIGGER IP BLOCK
def normalize_card(card):

        return {
                "id": card["id"],
                "name": card["name"],
                "type": card["type"],
                "frameType": card.get("frameType"),
                "desc": card["desc"],
                "atk": card.get("atk"),
                "defense": card.get("def"),
                "level": card.get("level"),
                "race": card.get("race"),
                "attribute": card.get("attribute")
        }

def save_card(card):

        card_obj, created = Card.objects.update_or_create(
            id=card["id"],
            defaults = normalize_card(card)
        )

        return card_obj

def import_all_cards():

    response = requests.get(BASE_URL)

    if response.status_code != status.HTTP_200_OK:
        return None

    card_data = response.json()["data"]

    for card in card_data:
        card_obj = save_card(card)
        image_import(card_obj)
    return None

def image_import(card_obj):

    if card_obj.image:
        return

    time.sleep(1)
    card_id = card_obj.id
    target_url = "f{IMAGE_URL}{card_id}.jpg"
    response = requests.get(target_url, timeout=30)
    response.raise_for_status()

    card_obj.image.save(f"images/{card_id}.png",
                        ContentFile(response.content),
                        save = True)