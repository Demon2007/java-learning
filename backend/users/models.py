from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    bio = models.TextField(blank=True, default="")
    coins = models.IntegerField(default=0)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    streak_days = models.IntegerField(default=0)
    last_login_date = models.DateField(null=True, blank=True)
    active_title = models.ForeignKey(
        "gamification.Title",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="active_users",
    )
    active_frame = models.ForeignKey(
        "gamification.ProfileFrame",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="active_frame_users",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email

    def add_xp(self, amount):
        self.xp += amount
        old_level = self.level
        self.level = self.calculate_level()
        self.save(update_fields=["xp", "level"])
        return self.level > old_level  # True if leveled up

    def add_coins(self, amount):
        self.coins += amount
        self.save(update_fields=["coins"])

    def calculate_level(self):
        if self.xp < 100:
            return 1
        import math
        return min(100, int(math.sqrt(self.xp / 100)) + 1)

    def xp_for_level(self, level):
        return (level - 1) ** 2 * 100

    def xp_progress_to_next_level(self):
        current_lvl_xp = self.xp_for_level(self.level)
        next_lvl_xp = self.xp_for_level(self.level + 1)
        if next_lvl_xp == current_lvl_xp:
            return 100
        progress = (self.xp - current_lvl_xp) / (next_lvl_xp - current_lvl_xp) * 100
        return round(min(100, max(0, progress)), 1)
