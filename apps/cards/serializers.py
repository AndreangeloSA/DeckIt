from rest_framework import serializers
from .models import Card
from ..users.models import FavoriteCards

class CardSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()
    small_image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return f"https://pub-6aee9263b7e24444b8ca3bc7c18b8d2c.r2.dev/{obj.id}.jpg"

    def get_small_image_url(self, obj):
        return f"https://pub-d71db2004de644c1a6db04b8f2957c4f.r2.dev/{obj.id}.webp"

    def get_is_favorite(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return FavoriteCards.objects.filter(
            user=request.user,
            card=obj
        ).exists()

    class Meta:
        model = Card
        fields = "__all__"