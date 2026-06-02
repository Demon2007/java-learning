from django.contrib import admin
from .models import Title, Achievement, UserAchievement, UserTitle, ProfileFrame, UserFrame


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    list_display = ["name", "rarity", "price_coins", "is_purchasable", "color"]
    list_filter = ["rarity", "is_purchasable"]
    search_fields = ["name"]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["name", "condition_type", "condition_value", "xp_reward", "coin_reward"]
    list_filter = ["condition_type"]
    search_fields = ["name"]


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ["user", "achievement", "earned_at"]
    list_filter = ["achievement"]
    search_fields = ["user__username", "achievement__name"]


@admin.register(UserTitle)
class UserTitleAdmin(admin.ModelAdmin):
    list_display = ["user", "title", "acquired_at"]
    search_fields = ["user__username", "title__name"]


@admin.register(ProfileFrame)
class ProfileFrameAdmin(admin.ModelAdmin):
    list_display = ["name", "rarity", "price_coins"]


@admin.register(UserFrame)
class UserFrameAdmin(admin.ModelAdmin):
    list_display = ["user", "frame", "is_active", "acquired_at"]
