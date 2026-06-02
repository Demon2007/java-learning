from django.contrib import admin
from .models import Category, Module, Lesson, Quiz, Question, UserLessonProgress, UserQuizAttempt


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "order", "is_locked"]
    list_filter = ["category", "is_locked"]


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 3


class QuizInline(admin.StackedInline):
    model = Quiz
    extra = 0


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ["title", "module", "difficulty", "xp_reward", "coin_reward", "duration_minutes", "order"]
    list_filter = ["difficulty", "module__category"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [QuizInline]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ["lesson", "xp_reward", "coin_reward"]
    inlines = [QuestionInline]


@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "lesson", "completed", "completed_at"]
    list_filter = ["completed"]
    search_fields = ["user__username", "lesson__title"]


@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ["user", "quiz", "score", "passed", "attempted_at"]
    list_filter = ["passed"]
