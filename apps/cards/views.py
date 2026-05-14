from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cards.models import Card
from apps.cards.serializers import CardSerializer


class CardSearchView(APIView):

    def get(self,request):

        cards = Card.objects.all()
        card_name = request.query_params.get("name")
        card_type = request.query_params.get("type")
        card_attribute = request.query_params.get("attribute")
        card_race = request.query_params.get("race")
        card_frametype = request.query_params.get("frametype")

        if card_name:
            cards = cards.filter(name__icontains=card_name)
        if card_type:
            cards = cards.filter(type=card_type)
        if card_attribute:
            cards = cards.filter(attribute=card_attribute)
        if card_race:
            cards = cards.filter(race=card_race)
        if card_frametype:
            cards.filter(frametype=card_frametype)

        serializer = CardSerializer(cards, many=True)

        return Response(serializer.data)



