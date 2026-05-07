import requests

BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"

def search_card(name):
    params = {"fname": name}

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return None

    data_card = response.json()

    card = data_card["data"][0]

    card_formatted = {
        "id": card["id"],
        "name": card["name"],
        "type": card["type"],
        "atk": card.get["atk"],
        "def": card.get["def"],
        "hp": card.get["hp"],
        "desc": card.get["desc"],
        "level": card.get["level"],
        "race": card.get["race"],
    }

    return card_formatted

