from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from apps.cards.models import Card
from apps.cards.serializers import CardSerializer

class CardSearchPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

# Restricts what card types will appear
def deck_section_selector(deck_section, cards):

    allowed_extra_deck_types = {
        "Fusion Monster",
        "Fusion Toon Effect Monster",
        "Link Monster",
        "Pendulum Effect Fusion Monster",
        "Synchro Monster",
        "Synchro Pendulum Effect Monster",
        "Synchro Tuner Monster",
        "XYZ Monster",
        "XYZ Pendulum Effect Monster",
    }

    if deck_section == "extra":
        return cards.filter(type__in=allowed_extra_deck_types)

    elif deck_section == "main":
        return cards.exclude(type__in=allowed_extra_deck_types)

    else:
        return cards


class CardSearchView(APIView):

    permission_classes = [AllowAny]
    pagination_class = CardSearchPagination

    def get(self, request):

        #retrieves all cards from database
        cards = Card.objects.all()

        #verifies search parameters
        card_id = request.query_params.get('id')
        card_name = request.query_params.get("name")
        card_type = request.query_params.get("type")
        card_attribute = request.query_params.get("attribute")
        card_race = request.query_params.get("race")
        card_frametype = request.query_params.get("frameType")
        card_atk_exact = request.query_params.get("atk")
        card_atk_min = request.query_params.get("atk_min")
        card_atk_max = request.query_params.get("atk_max")
        card_def_exact = request.query_params.get("defense")
        card_def_min = request.query_params.get("def_min")
        card_def_max = request.query_params.get("def_max")
        card_level_exact = request.query_params.get("level")
        card_level_min = request.query_params.get("level_min")
        card_level_max = request.query_params.get("level_max")
        deck_section = request.query_params.get("deck_section")

        #filters cards based on basic parameters
        if card_id:
            cards = cards.filter(id__iexact=card_id)
        if card_type:
            cards = cards.filter(type__iexact=card_type)
        if card_attribute:
            cards = cards.filter(attribute__iexact=card_attribute)
        if card_race:
            cards = cards.filter(race__iexact=card_race)
        if card_frametype:
            cards = cards.filter(frameType__iexact=card_frametype)
        if card_name:
            cards = cards.filter(name__icontains=card_name)

        #filters based on complex parameters and ranges
        def apply_range(queryset, field, exact=None, minimum=None, maximum=None):
            if exact is not None:
                return queryset.filter(**{f"{field}__exact": exact})

            if minimum is not None:
                queryset = queryset.filter(**{f"{field}__gte": minimum})

            if maximum is not None:
                queryset = queryset.filter(**{f"{field}__lte": maximum})

            return queryset

        cards = apply_range(cards, "atk", card_atk_exact, card_atk_min, card_atk_max)
        cards = apply_range(cards, "defense", card_def_exact, card_def_min, card_def_max)
        cards = apply_range(cards, "level", card_level_exact, card_level_min, card_level_max)

        if deck_section:
            cards = deck_section_selector(deck_section, cards)

        cards = cards.order_by("id")
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(cards, request, view=self)

        serializer = CardSerializer(page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)