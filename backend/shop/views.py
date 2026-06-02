from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ShopItem, Purchase
from .serializers import ShopItemSerializer
from gamification.models import UserTitle, UserFrame


class ShopItemListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = ShopItem.objects.filter(is_available=True)
        item_type = request.query_params.get("type")
        if item_type:
            items = items.filter(item_type=item_type)
        serializer = ShopItemSerializer(items, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class PurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            item = ShopItem.objects.get(pk=pk, is_available=True)
        except ShopItem.DoesNotExist:
            return Response({"success": False, "message": "Item not found."}, status=404)

        if Purchase.objects.filter(user=request.user, shop_item=item).exists():
            return Response({"success": False, "message": "You already own this item."}, status=400)

        if request.user.coins < item.price_coins:
            return Response({"success": False, "message": f"Not enough coins. You need {item.price_coins} but have {request.user.coins}."}, status=400)

        request.user.coins -= item.price_coins
        request.user.save(update_fields=["coins"])

        Purchase.objects.create(user=request.user, shop_item=item, price_paid=item.price_coins)

        if item.item_type == "title" and item.title:
            UserTitle.objects.get_or_create(user=request.user, title=item.title)
        elif item.item_type == "frame" and item.frame:
            UserFrame.objects.get_or_create(user=request.user, frame=item.frame)

        return Response({
            "success": True,
            "data": {
                "message": f"Successfully purchased {item.name}!",
                "coins_remaining": request.user.coins,
                "item": ShopItemSerializer(item, context={"request": request}).data,
            }
        })
