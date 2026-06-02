from .models import Achievement, UserAchievement


def check_achievements(user):
    """Check all achievement conditions for a user and award any newly earned achievements."""
    all_achievements = Achievement.objects.all()
    earned_ids = set(user.achievements.values_list("achievement_id", flat=True))
    new_achievements = []

    lessons_completed = user.lesson_progress.filter(completed=True).count()
    perfect_quizzes = user.quiz_attempts.filter(passed=True, score=100).count() if hasattr(user, "quiz_attempts") else 0

    for achievement in all_achievements:
        if achievement.id in earned_ids:
            continue

        earned = False
        ct = achievement.condition_type
        cv = achievement.condition_value

        if ct == "lessons_completed" and lessons_completed >= cv:
            earned = True
        elif ct == "streak_days" and user.streak_days >= cv:
            earned = True
        elif ct == "xp_earned" and user.xp >= cv:
            earned = True
        elif ct == "quiz_perfect" and perfect_quizzes >= cv:
            earned = True
        elif ct == "first_login" and user.last_login_date is not None:
            earned = True

        if earned:
            UserAchievement.objects.create(user=user, achievement=achievement)
            user.add_xp(achievement.xp_reward)
            user.add_coins(achievement.coin_reward)
            new_achievements.append(achievement)

    return new_achievements
