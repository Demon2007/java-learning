from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import User
from .models import Title, Achievement, UserTitle, ProfileFrame, UserFrame
from .serializers import TitleSerializer, AchievementSerializer, ProfileFrameSerializer, LeaderboardUserSerializer


class TitleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        titles = Title.objects.all()
        serializer = TitleSerializer(titles, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class SetActiveTitleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            title = Title.objects.get(pk=pk)
        except Title.DoesNotExist:
            return Response({"success": False, "message": "Title not found."}, status=404)
        if not UserTitle.objects.filter(user=request.user, title=title).exists():
            return Response({"success": False, "message": "You do not own this title."}, status=403)
        request.user.active_title = title
        request.user.save(update_fields=["active_title"])
        return Response({"success": True, "message": f"Title '{title.name}' activated."})


class RemoveTitleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.active_title = None
        request.user.save(update_fields=["active_title"])
        return Response({"success": True, "message": "Title removed."})


class AchievementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        achievements = Achievement.objects.all()
        serializer = AchievementSerializer(achievements, many=True, context={"request": request})
        earned_count = request.user.achievements.count()
        return Response({
            "success": True,
            "data": serializer.data,
            "meta": {"earned": earned_count, "total": achievements.count()}
        })


class UserTitlesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owned = UserTitle.objects.filter(user=request.user).select_related("title")
        data = []
        for ut in owned:
            t = ut.title
            data.append({
                "id": t.id, "name": t.name, "description": t.description,
                "icon": t.icon, "rarity": t.rarity, "color": t.color,
                "acquired_at": ut.acquired_at,
                "is_active": request.user.active_title_id == t.id,
            })
        return Response({"success": True, "data": data})


class UserFramesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owned = UserFrame.objects.filter(user=request.user).select_related("frame")
        data = []
        for uf in owned:
            f = uf.frame
            data.append({
                "id": f.id, "name": f.name, "css_gradient": f.css_gradient,
                "color_primary": f.color_primary, "color_secondary": f.color_secondary,
                "is_active": uf.is_active, "acquired_at": uf.acquired_at,
            })
        return Response({"success": True, "data": data})


class SetActiveFrameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            uf = UserFrame.objects.get(user=request.user, frame_id=pk)
        except UserFrame.DoesNotExist:
            return Response({"success": False, "message": "Frame not owned."}, status=403)
        UserFrame.objects.filter(user=request.user).update(is_active=False)
        uf.is_active = True
        uf.save()
        request.user.active_frame_id = pk
        request.user.save(update_fields=["active_frame"])
        return Response({"success": True, "message": "Frame activated."})


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(is_active=True).order_by("-xp")[:100]
        data = []
        for rank, user in enumerate(users, 1):
            avatar_url = None
            if user.avatar:
                avatar_url = request.build_absolute_uri(user.avatar.url)
            data.append({
                "id": user.id,
                "rank": rank,
                "username": user.username,
                "avatar_url": avatar_url,
                "level": user.level,
                "xp": user.xp,
                "streak_days": user.streak_days,
                "active_title": {"name": user.active_title.name, "color": user.active_title.color, "icon": user.active_title.icon} if user.active_title else None,
            })
        current_user_rank = None
        for i, u in enumerate(User.objects.filter(is_active=True).order_by("-xp"), 1):
            if u.id == request.user.id:
                current_user_rank = i
                break
        return Response({"success": True, "data": data, "meta": {"current_user_rank": current_user_rank}})
