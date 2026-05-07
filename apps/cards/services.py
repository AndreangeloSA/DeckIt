import requests

BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"

def search_card(name):
    params = {"fname": name}

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return None

    dados_carta = response.json()

    carta = dados_carta["data"][0]

    carta_formatada = {
        "nome": carta["name"],
        "type": carta["type"],
        "atk": carta.get["atk"],
        "def": carta.get["def"],
        "hp": carta.get["hp"],
        "desc": carta.get["desc"],
        "level": carta.get["level"],
        "race": carta.get["race"],
    }

    return carta_formatada

