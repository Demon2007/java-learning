from django.contrib import admin
from .models import ShopItem, Purchase


@admin.register(ShopItem)
class ShopItemAdmin(admin.ModelAdmin):
    list_display = ["name", "item_type", "price_coins", "is_available"]
    list_filter = ["item_type", "is_available"]
    search_fields = ["name"]


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ["user", "shop_item", "price_paid", "purchased_at"]
    list_filter = ["shop_item__item_type"]
    search_fields = ["user__username"]
