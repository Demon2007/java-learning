from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import User
from .serializers import (
    UserRegisterSerializer, UserProfileSerializer,
    UserUpdateSerializer, ChangePasswordSerializer, PublicUserSerializer,
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            profile = UserProfileSerializer(user, context={"request": request}).data
            return Response({"success": True, "data": {"tokens": tokens, "user": profile}}, status=201)
        return Response({"success": False, "errors": serializer.errors}, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("email", "").strip()
        password = request.data.get("password", "")
        try:
            # Support login by email or username
            if "@" in identifier:
                user_obj = User.objects.get(email=identifier.lower())
            else:
                user_obj = User.objects.get(username__iexact=identifier)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid credentials."}, status=401)
        user = authenticate(request, username=user_obj.email, password=password)
        if not user:
            return Response({"success": False, "message": "Invalid credentials."}, status=401)
        tokens = get_tokens_for_user(user)
        profile = UserProfileSerializer(user, context={"request": request}).data
        return Response({"success": True, "data": {"tokens": tokens, "user": profile}})


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except TokenError:
            pass
        return Response({"success": True, "message": "Logged out successfully."})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={"request": request})
        return Response({"success": True, "data": serializer.data})

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            full = UserProfileSerializer(request.user, context={"request": request}).data
            return Response({"success": True, "data": full})
        return Response({"success": False, "errors": serializer.errors}, status=400)


class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if "avatar" not in request.FILES:
            return Response({"success": False, "message": "No image provided."}, status=400)
        user = request.user
        if user.avatar:
            import os
            if os.path.exists(user.avatar.path):
                os.remove(user.avatar.path)
        user.avatar = request.FILES["avatar"]
        user.save(update_fields=["avatar"])
        profile = UserProfileSerializer(user, context={"request": request}).data
        return Response({"success": True, "data": profile})

    def delete(self, request):
        user = request.user
        if user.avatar:
            import os
            if os.path.exists(user.avatar.path):
                os.remove(user.avatar.path)
            user.avatar = None
            user.save(update_fields=["avatar"])
        return Response({"success": True, "message": "Avatar removed."})


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=400)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"success": False, "message": "Old password is incorrect."}, status=400)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"success": True, "message": "Password changed successfully."})


class DailyLoginView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        today = timezone.now().date()
        if user.last_login_date == today:
            return Response({"success": True, "data": {"already_claimed": True, "xp": 0, "coins": 0}})

        xp_reward = 25
        coin_reward = 5

        if user.last_login_date:
            from datetime import timedelta
            if (today - user.last_login_date).days == 1:
                user.streak_days += 1
                if user.streak_days % 7 == 0:
                    xp_reward += 50
                    coin_reward += 20
            else:
                user.streak_days = 1
        else:
            user.streak_days = 1

        user.last_login_date = today
        user.save(update_fields=["last_login_date", "streak_days"])
        leveled_up = user.add_xp(xp_reward)
        user.add_coins(coin_reward)

        from gamification.utils import check_achievements
        new_achievements = check_achievements(user)

        return Response({
            "success": True,
            "data": {
                "already_claimed": False,
                "xp": xp_reward,
                "coins": coin_reward,
                "streak_days": user.streak_days,
                "leveled_up": leveled_up,
                "new_level": user.level,
                "new_achievements": [{"name": a.name, "icon": a.icon} for a in new_achievements],
            }
        })


class PublicProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found."}, status=404)
        serializer = PublicUserSerializer(user, context={"request": request})
        return Response({"success": True, "data": serializer.data})
