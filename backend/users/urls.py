from django.urls import path
from .views import ProfileView, AvatarUploadView, ChangePasswordView, DailyLoginView, PublicProfileView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
    path("avatar/", AvatarUploadView.as_view(), name="avatar"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("daily-login/", DailyLoginView.as_view(), name="daily_login"),
    path("<int:pk>/", PublicProfileView.as_view(), name="public_profile"),
]
