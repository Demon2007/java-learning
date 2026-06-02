from django.db import models


class Title(models.Model):
    RARITY_CHOICES = [
        ("common", "Common"),
        ("rare", "Rare"),
        ("epic", "Epic"),
        ("legendary", "Legendary"),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default="Crown")
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default="common")
    price_coins = models.IntegerField(default=0)
    is_purchasable = models.BooleanField(default=True)
    unlock_condition = models.CharField(max_length=200, blank=True)
    color = models.CharField(max_length=20, default="#7c3aed")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Achievement(models.Model):
    CONDITION_TYPES = [
        ("lessons_completed", "Lessons Completed"),
        ("streak_days", "Streak Days"),
        ("xp_earned", "XP Earned"),
        ("quiz_perfect", "Perfect Quiz Score"),
        ("module_completed", "Module Completed"),
        ("first_login", "First Login"),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default="Star")
    xp_reward = models.IntegerField(default=100)
    coin_reward = models.IntegerField(default=50)
    condition_type = models.CharField(max_length=50, choices=CONDITION_TYPES)
    condition_value = models.IntegerField(default=1)
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["condition_type", "condition_value"]

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="user_achievements")
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "achievement")

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"


class UserTitle(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="titles")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="user_titles")
    acquired_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "title")

    def __str__(self):
        return f"{self.user.username} - {self.title.name}"


class ProfileFrame(models.Model):
    RARITY_CHOICES = [("common","Common"),("rare","Rare"),("epic","Epic"),("legendary","Legendary")]
    name = models.CharField(max_length=100)
    description = models.TextField()
    price_coins = models.IntegerField(default=100)
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default="common")
    color_primary = models.CharField(max_length=20, default="#7c3aed")
    color_secondary = models.CharField(max_length=20, default="#9333ea")
    css_gradient = models.CharField(max_length=200, default="linear-gradient(135deg, #7c3aed, #9333ea)")

    def __str__(self):
        return self.name


class UserFrame(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="frames")
    frame = models.ForeignKey(ProfileFrame, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    acquired_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "frame")
