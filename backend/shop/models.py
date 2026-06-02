from django.db import models


class ShopItem(models.Model):
    ITEM_TYPES = [("title", "Title"), ("frame", "Frame"), ("badge", "Badge")]
    name = models.CharField(max_length=100)
    description = models.TextField()
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    title = models.ForeignKey("gamification.Title", null=True, blank=True, on_delete=models.SET_NULL, related_name="shop_items")
    frame = models.ForeignKey("gamification.ProfileFrame", null=True, blank=True, on_delete=models.SET_NULL, related_name="shop_items")
    price_coins = models.IntegerField(default=100)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["item_type", "price_coins"]

    def __str__(self):
        return f"{self.name} ({self.item_type})"


class Purchase(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="purchases")
    shop_item = models.ForeignKey(ShopItem, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)
    price_paid = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} bought {self.shop_item.name}"
