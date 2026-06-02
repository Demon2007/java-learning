from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ["email", "username", "level", "xp", "coins", "streak_days", "is_active", "created_at"]
    list_filter = ["level", "is_active", "is_staff"]
    search_fields = ["email", "username"]
    ordering = ["-created_at"]
    fieldsets = UserAdmin.fieldsets + (
        ("Game Stats", {"fields": ("avatar", "bio", "coins", "xp", "level", "streak_days", "last_login_date", "active_title", "active_frame")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Profile", {"fields": ("email",)}),
    )
