from rest_framework import serializers
from .models import Title, Achievement, UserAchievement, UserTitle, ProfileFrame, UserFrame


class TitleSerializer(serializers.ModelSerializer):
    is_owned = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = ["id", "name", "description", "icon", "rarity", "price_coins", "color", "is_purchasable", "is_owned", "is_active"]

    def get_is_owned(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return UserTitle.objects.filter(user=user, title=obj).exists()

    def get_is_active(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return user.active_title_id == obj.id


class AchievementSerializer(serializers.ModelSerializer):
    is_earned = serializers.SerializerMethodField()
    earned_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = ["id", "name", "description", "icon", "xp_reward", "coin_reward", "condition_type", "condition_value", "is_hidden", "is_earned", "earned_at"]

    def get_is_earned(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return UserAchievement.objects.filter(user=user, achievement=obj).exists()

    def get_earned_at(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return None
        ua = UserAchievement.objects.filter(user=user, achievement=obj).first()
        return ua.earned_at if ua else None


class ProfileFrameSerializer(serializers.ModelSerializer):
    is_owned = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = ProfileFrame
        fields = ["id", "name", "description", "price_coins", "rarity", "color_primary", "color_secondary", "css_gradient", "is_owned", "is_active"]

    def get_is_owned(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return UserFrame.objects.filter(user=user, frame=obj).exists()

    def get_is_active(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return user.active_frame_id == obj.id


class LeaderboardUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar_url = serializers.SerializerMethodField()
    level = serializers.IntegerField()
    xp = serializers.IntegerField()
    streak_days = serializers.IntegerField()
    active_title = serializers.SerializerMethodField()
    rank = serializers.IntegerField()

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_active_title(self, obj):
        if obj.active_title:
            return {"name": obj.active_title.name, "color": obj.active_title.color, "icon": obj.active_title.icon}
        return None
