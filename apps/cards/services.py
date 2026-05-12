import requests
from .models import Card

BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"

def search_card(name):

        params = {"fname": name}

        response = requests.get(BASE_URL, params=params)

        if response.status_code != 200:
            return None

        card_data = response.json()

        card = card_data["data"][0]

        formatted_card = normalize_card(card)

        return formatted_card

def normalize_card(card):

        return {
                "id": card["id"],
                "name": card["name"],
                "type": card["type"],
                "atk": card.get("atk"),
                "defense": card.get("def"),
                "desc": card.get("desc"),
                "level": card.get("level"),
                "race": card.get("race"),
        }

def save_card(formatted_card):

        Card.objects.update_or_create(
            id=formatted_card["id"],
            defaults = formatted_card
        )

