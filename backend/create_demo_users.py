"""
Run with: venv/Scripts/python.exe create_demo_users.py
Creates 15 demo users with varying XP/levels for the leaderboard.
"""
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.utils import timezone
from users.models import User
from lessons.models import Lesson, UserLessonProgress
from gamification.models import Achievement, UserAchievement

DEMO_USERS = [
    ("AliceJava",   "alice@demo.com",   2400, 35, 14),
    ("BobCoder",    "bob@demo.com",     1900, 28, 10),
    ("CharlieOOP",  "charlie@demo.com", 1600, 22,  8),
    ("DanaStream",  "dana@demo.com",    1350, 18,  7),
    ("EgorByte",    "egor@demo.com",    1100, 15,  5),
    ("FatimaJVM",   "fatima@demo.com",   900, 12,  4),
    ("GlebArray",   "gleb@demo.com",     720, 10,  3),
    ("HanaLambda",  "hana@demo.com",     580,  8,  3),
    ("IvanClass",   "ivan@demo.com",     450,  7,  2),
    ("JuliaMaps",   "julia@demo.com",    340,  5,  2),
    ("KirillLoop",  "kirill@demo.com",   250,  4,  1),
    ("LenaBool",    "lena@demo.com",     180,  3,  1),
    ("MaxThread",   "max@demo.com",      130,  2,  0),
    ("NinaStack",   "nina@demo.com",      80,  1,  0),
    ("OlegRecur",   "oleg@demo.com",      40,  0,  0),
]

lessons = list(Lesson.objects.all())
today = timezone.now().date()

created = 0
for username, email, xp, streak, num_lessons in DEMO_USERS:
    if User.objects.filter(email=email).exists():
        print(f"  skip {username} (exists)")
        continue

    user = User.objects.create_user(
        username=username,
        email=email,
        password="demo1234",
    )
    # Set XP / level without triggering level-up logic
    user.xp = xp % (user.calculate_level() * 100)  # keep within level
    user.xp = xp
    user.level = user.calculate_level()
    user.streak_days = streak
    user.last_login_date = today
    user.save(update_fields=["xp", "level", "streak_days", "last_login_date"])

    # Mark some lessons completed
    for lesson in lessons[:num_lessons]:
        UserLessonProgress.objects.get_or_create(
            user=user, lesson=lesson,
            defaults={"completed": True, "completed_at": timezone.now()}
        )

    created += 1
    print(f"  created {username}  xp={xp}  level={user.level}  lessons={num_lessons}")

print(f"\nDone. Created {created} demo users.")
