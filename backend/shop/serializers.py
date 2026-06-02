from rest_framework import serializers
from .models import ShopItem, Purchase


class ShopItemSerializer(serializers.ModelSerializer):
    is_owned = serializers.SerializerMethodField()
    title_color = serializers.SerializerMethodField()
    title_rarity = serializers.SerializerMethodField()
    frame_gradient = serializers.SerializerMethodField()

    class Meta:
        model = ShopItem
        fields = ["id", "name", "description", "item_type", "price_coins", "is_available", "is_owned", "title_color", "title_rarity", "frame_gradient"]

    def get_is_owned(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return Purchase.objects.filter(user=user, shop_item=obj).exists()

    def get_title_color(self, obj):
        if obj.title:
            return obj.title.color
        return None

    def get_title_rarity(self, obj):
        if obj.title:
            return obj.title.rarity
        return None

    def get_frame_gradient(self, obj):
        if obj.frame:
            return obj.frame.css_gradient
        return None
