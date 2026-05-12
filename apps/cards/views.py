from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.cards.services import search_card, save_card


@api_view(['GET'])
def search_card_view(request):
    name = request.GET.get('name')

    if not name:
        return Response({"erro": "Provide card name"}, status=400)

    card = search_card(name)
    save_card(card)

    if not card:
        return Response({"erro": "Card not found"}, status=404)

    return Response(card)

