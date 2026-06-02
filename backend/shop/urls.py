from django.urls import path
from .views import ShopItemListView, PurchaseView

urlpatterns = [
    path("", ShopItemListView.as_view(), name="shop"),
    path("<int:pk>/purchase/", PurchaseView.as_view(), name="purchase"),
]
