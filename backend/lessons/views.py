from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Category, Module, Lesson, Quiz, Question, UserLessonProgress, UserQuizAttempt
from .serializers import (
    CategorySerializer, ModuleSerializer, LessonListSerializer,
    LessonDetailSerializer, QuizSerializer, QuestionWithAnswerSerializer, QuizSubmitSerializer,
)
from gamification.utils import check_achievements


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.prefetch_related("modules__lessons").all()
        serializer = CategorySerializer(categories, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class CategoryDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            category = Category.objects.prefetch_related("modules__lessons").get(slug=slug)
        except Category.DoesNotExist:
            return Response({"success": False, "message": "Category not found."}, status=404)
        serializer = CategorySerializer(category, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class LessonListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        module_id = request.query_params.get("module")
        category_slug = request.query_params.get("category")
        lessons = Lesson.objects.select_related("module__category").all()
        if module_id:
            lessons = lessons.filter(module_id=module_id)
        if category_slug:
            lessons = lessons.filter(module__category__slug=category_slug)
        serializer = LessonListSerializer(lessons, many=True, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class LessonDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            lesson = Lesson.objects.select_related("module__category").get(slug=slug)
        except Lesson.DoesNotExist:
            return Response({"success": False, "message": "Lesson not found."}, status=404)
        serializer = LessonDetailSerializer(lesson, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class CompleteLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({"success": False, "message": "Lesson not found."}, status=404)

        progress, created = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        if progress.completed:
            return Response({"success": True, "data": {"already_completed": True, "xp": 0, "coins": 0}})

        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()

        leveled_up = request.user.add_xp(lesson.xp_reward)
        request.user.add_coins(lesson.coin_reward)
        new_achievements = check_achievements(request.user)

        return Response({
            "success": True,
            "data": {
                "already_completed": False,
                "xp": lesson.xp_reward,
                "coins": lesson.coin_reward,
                "leveled_up": leveled_up,
                "new_level": request.user.level,
                "new_achievements": [{"name": a.name, "icon": a.icon, "xp_reward": a.xp_reward} for a in new_achievements],
            }
        })


class QuizDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_pk):
        try:
            quiz = Quiz.objects.prefetch_related("questions").get(lesson_id=lesson_pk)
        except Quiz.DoesNotExist:
            return Response({"success": False, "message": "Quiz not found."}, status=404)
        serializer = QuizSerializer(quiz, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class QuizSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_pk):
        try:
            quiz = Quiz.objects.prefetch_related("questions").get(pk=quiz_pk)
        except Quiz.DoesNotExist:
            return Response({"success": False, "message": "Quiz not found."}, status=404)

        serializer = QuizSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=400)

        answers = serializer.validated_data["answers"]
        questions = list(quiz.questions.order_by("order"))
        total = len(questions)

        if len(answers) != total:
            return Response({"success": False, "message": f"Expected {total} answers."}, status=400)

        correct_count = sum(1 for q, a in zip(questions, answers) if q.correct_answer == a)
        score = round(correct_count / total * 100) if total > 0 else 0
        passed = score >= 70

        attempt = UserQuizAttempt.objects.create(
            user=request.user, quiz=quiz,
            score=score, total_questions=total, passed=passed,
        )

        xp_earned = 0
        coins_earned = 0
        leveled_up = False
        new_achievements = []

        if passed:
            xp_earned = quiz.xp_reward
            coins_earned = quiz.coin_reward
            leveled_up = request.user.add_xp(xp_earned)
            request.user.add_coins(coins_earned)
            new_achievements = check_achievements(request.user)

        results = []
        for i, (q, a) in enumerate(zip(questions, answers)):
            results.append({
                "question_id": q.id,
                "question": q.text,
                "your_answer": a,
                "correct_answer": q.correct_answer,
                "is_correct": q.correct_answer == a,
                "explanation": q.explanation,
            })

        return Response({
            "success": True,
            "data": {
                "score": score,
                "correct": correct_count,
                "total": total,
                "passed": passed,
                "xp_earned": xp_earned,
                "coins_earned": coins_earned,
                "leveled_up": leveled_up,
                "new_level": request.user.level,
                "results": results,
                "new_achievements": [{"name": a.name, "icon": a.icon} for a in new_achievements],
            }
        })


class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        total_lessons = Lesson.objects.count()
        completed_lessons = user.lesson_progress.filter(completed=True).count()
        total_quizzes = Quiz.objects.count()
        passed_quizzes = user.quiz_attempts.filter(passed=True).values("quiz").distinct().count()
        progress_pct = round(completed_lessons / total_lessons * 100, 1) if total_lessons > 0 else 0

        recent_lessons = user.lesson_progress.filter(completed=True).select_related("lesson").order_by("-completed_at")[:5]
        recent_data = [{"id": p.lesson.id, "title": p.lesson.title, "slug": p.lesson.slug, "completed_at": p.completed_at} for p in recent_lessons]

        return Response({
            "success": True,
            "data": {
                "total_lessons": total_lessons,
                "completed_lessons": completed_lessons,
                "progress_pct": progress_pct,
                "total_quizzes": total_quizzes,
                "passed_quizzes": passed_quizzes,
                "recent_lessons": recent_data,
                "xp": user.xp,
                "level": user.level,
                "coins": user.coins,
                "streak_days": user.streak_days,
                "xp_progress": user.xp_progress_to_next_level(),
                "xp_for_next_level": user.xp_for_level(user.level + 1),
            }
        })
