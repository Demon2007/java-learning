from django.urls import path
from .views import (
    CategoryListView, CategoryDetailView,
    LessonListView, LessonDetailView, CompleteLessonView,
    QuizDetailView, QuizSubmitView, UserProgressView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="categories"),
    path("categories/<slug:slug>/", CategoryDetailView.as_view(), name="category_detail"),
    path("", LessonListView.as_view(), name="lessons"),
    path("<slug:slug>/", LessonDetailView.as_view(), name="lesson_detail"),
    path("<int:pk>/complete/", CompleteLessonView.as_view(), name="complete_lesson"),
    path("<int:lesson_pk>/quiz/", QuizDetailView.as_view(), name="quiz"),
    path("quiz/<int:quiz_pk>/submit/", QuizSubmitView.as_view(), name="quiz_submit"),
    path("progress/overview/", UserProgressView.as_view(), name="progress"),
]
