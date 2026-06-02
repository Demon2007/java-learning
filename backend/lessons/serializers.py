from rest_framework import serializers
from .models import Category, Module, Lesson, Quiz, Question, UserLessonProgress, UserQuizAttempt


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "options", "order"]


class QuestionWithAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "options", "correct_answer", "explanation", "order"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "title", "xp_reward", "coin_reward", "questions", "questions_count"]

    def get_questions_count(self, obj):
        return obj.questions.count()


class LessonListSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    has_quiz = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ["id", "title", "slug", "difficulty", "duration_minutes", "xp_reward", "coin_reward", "order", "is_completed", "has_quiz"]

    def get_is_completed(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return UserLessonProgress.objects.filter(user=user, lesson=obj, completed=True).exists()

    def get_has_quiz(self, obj):
        return hasattr(obj, "quiz")


class LessonDetailSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    quiz = QuizSerializer(read_only=True)
    module_id = serializers.IntegerField(source="module.id", read_only=True)
    module_title = serializers.CharField(source="module.title", read_only=True)
    category_name = serializers.CharField(source="module.category.name", read_only=True)
    next_lesson = serializers.SerializerMethodField()
    prev_lesson = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id", "title", "slug", "content", "code_example",
            "difficulty", "duration_minutes", "xp_reward", "coin_reward",
            "module_id", "module_title", "category_name",
            "is_completed", "quiz", "next_lesson", "prev_lesson", "created_at",
        ]

    def get_is_completed(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return False
        return UserLessonProgress.objects.filter(user=user, lesson=obj, completed=True).exists()

    def get_next_lesson(self, obj):
        next_l = Lesson.objects.filter(module=obj.module, order__gt=obj.order).order_by("order").first()
        if next_l:
            return {"id": next_l.id, "slug": next_l.slug, "title": next_l.title}
        return None

    def get_prev_lesson(self, obj):
        prev_l = Lesson.objects.filter(module=obj.module, order__lt=obj.order).order_by("-order").first()
        if prev_l:
            return {"id": prev_l.id, "slug": prev_l.slug, "title": prev_l.title}
        return None


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonListSerializer(many=True, read_only=True)
    lessons_count = serializers.SerializerMethodField()
    completed_count = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "is_locked", "lessons", "lessons_count", "completed_count"]

    def get_lessons_count(self, obj):
        return obj.lessons.count()

    def get_completed_count(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return 0
        return UserLessonProgress.objects.filter(user=user, lesson__module=obj, completed=True).count()


class CategorySerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    total_lessons = serializers.SerializerMethodField()
    completed_lessons = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "icon", "color", "order", "modules", "total_lessons", "completed_lessons"]

    def get_total_lessons(self, obj):
        return Lesson.objects.filter(module__category=obj).count()

    def get_completed_lessons(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if not user or not user.is_authenticated:
            return 0
        return UserLessonProgress.objects.filter(user=user, lesson__module__category=obj, completed=True).count()


class QuizSubmitSerializer(serializers.Serializer):
    answers = serializers.ListField(child=serializers.IntegerField())
