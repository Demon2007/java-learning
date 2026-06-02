from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class TitleMiniSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    color = serializers.CharField()
    icon = serializers.CharField()
    rarity = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    active_title = TitleMiniSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    lessons_completed = serializers.SerializerMethodField()
    achievements_count = serializers.SerializerMethodField()
    xp_progress = serializers.SerializerMethodField()
    xp_for_next_level = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "avatar_url", "bio",
            "coins", "xp", "level", "streak_days",
            "active_title", "created_at",
            "lessons_completed", "achievements_count",
            "xp_progress", "xp_for_next_level",
        ]
        read_only_fields = ["id", "email", "coins", "xp", "level", "streak_days", "created_at"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_lessons_completed(self, obj):
        return obj.lesson_progress.filter(completed=True).count()

    def get_achievements_count(self, obj):
        return obj.achievements.count()

    def get_xp_progress(self, obj):
        return obj.xp_progress_to_next_level()

    def get_xp_for_next_level(self, obj):
        return obj.xp_for_level(obj.level + 1)


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2"]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "bio"]

    def validate_username(self, value):
        user = self.context["request"].user
        if User.objects.filter(username=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Username already taken.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        return data


class PublicUserSerializer(serializers.ModelSerializer):
    active_title = TitleMiniSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    lessons_completed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "avatar_url", "level", "xp", "streak_days", "active_title", "lessons_completed"]

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_lessons_completed(self, obj):
        return obj.lesson_progress.filter(completed=True).count()
