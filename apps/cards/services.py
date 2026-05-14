import requests
from .models import Card

BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"

def normalize_card(card):

        return {
                "id": card.get["id"],
                "name": card.get["name"],
                "type": card.get["type"],
                "frametype": card.get["frametype"],
                "desc": card.get("desc"),
                "atk": card.get("atk"),
                "defense": card.get("def"),
                "level": card.get("level"),
                "race": card.get("race"),
                "attribute": card.get("attribute"),
        }

def save_card(card):

        #slow for now, will implement bulk create/update action at some point
        formatted_card = normalize_card(card)
        Card.objects.update_or_create(
            id=formatted_card["id"],
            defaults = formatted_card
        )

def import_all_cards():

    response = requests.get(BASE_URL)

    if response.status_code != 200:
        return None

    card_data = response.json()

    for card in card_data:
        formatted_card = normalize_card(card)
        save_card(formatted_card)

