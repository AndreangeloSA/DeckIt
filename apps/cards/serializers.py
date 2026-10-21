from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return f"https://pub-6aee9263b7e24444b8ca3bc7c18b8d2c.r2.dev/{obj.id}.jpg"

    class Meta:
        model = Card
        fields = "__all__"