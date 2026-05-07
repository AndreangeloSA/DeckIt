from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import search_card

@api_view(['GET'])
def search_card_view(request):
    name = request.GET.get('nome')

    if not name:
        return Response({"erro": "Informe o nome da carta"}, status=400)

    dados = search_card(name)

    if not dados:
        return Response({"erro": "Carta não encontrada"}, status=404)

    return Response(dados)

