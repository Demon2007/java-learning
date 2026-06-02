from django.urls import path
from .views import (
    TitleListView, SetActiveTitleView, RemoveTitleView,
    AchievementListView, UserTitlesView, UserFramesView, SetActiveFrameView,
    LeaderboardView,
)

urlpatterns = [
    path("titles/", TitleListView.as_view(), name="titles"),
    path("titles/<int:pk>/activate/", SetActiveTitleView.as_view(), name="activate_title"),
    path("titles/remove/", RemoveTitleView.as_view(), name="remove_title"),
    path("achievements/", AchievementListView.as_view(), name="achievements"),
    path("my-titles/", UserTitlesView.as_view(), name="my_titles"),
    path("my-frames/", UserFramesView.as_view(), name="my_frames"),
    path("frames/<int:pk>/activate/", SetActiveFrameView.as_view(), name="activate_frame"),
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
]
