import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Calendar, ChevronRight, Coins, Star, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import useGameStore from "@/store/gameStore";
import { useT } from "@/hooks/useT";
import authService from "@/services/auth.service";
import lessonsService from "@/services/lessons.service";
import gamificationService from "@/services/gamification.service";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import XPBar from "@/components/gamification/XPBar";
import StreakCard from "@/components/gamification/StreakCard";
import Avatar from "@/components/ui/Avatar";

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const { showLevelUp, queueAchievement } = useGameStore();
  const queryClient = useQueryClient();
  const t = useT();

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => lessonsService.getProgress().then(r => r.data.data),
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  const { data: categories, isLoading: lessonsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => lessonsService.getCategories().then(r => r.data.data),
    staleTime: 60000,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => gamificationService.getLeaderboard().then(r => r.data),
    refetchInterval: 30000,
  });
  const leaderboard = leaderboardData?.data;

  const dailyMutation = useMutation({
    mutationFn: authService.dailyLogin,
    onSuccess: async (res) => {
      const data = res.data.data;
      if (data.already_claimed) {
        toast(t("dashboard.already_claimed"), { icon: "📅" });
      } else {
        toast.success(`+${data.xp} XP +${data.coins} Coins`);
        if (data.leveled_up) showLevelUp(data.new_level);
        data.new_achievements?.forEach(a => queueAchievement(a));
        // Fetch fresh profile → updates Navbar/Sidebar XP+coins immediately
        try {
          const profileRes = await authService.getProfile();
          setUser(profileRes.data.data);
        } catch {}
        queryClient.invalidateQueries({ queryKey: ["progress"] });
      }
    },
  });

  const allLessons = categories?.flatMap(c => c.modules?.flatMap(m => m.lessons) ?? []) ?? [];
  const nextLessons = allLessons.filter(l => !l.is_completed).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4 sm:space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t("dashboard.welcome")} <span className="gradient-text">{user?.username}</span>! 👋
          </h1>
          <p className="text-muted mt-1 text-sm">{t("dashboard.sub")}</p>
        </div>
        <Button icon={Calendar} onClick={() => dailyMutation.mutate()} loading={dailyMutation.isPending} variant="secondary" size="sm">
          {t("dashboard.daily_btn")}
        </Button>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <XPBar user={user} />
        <StreakCard days={user?.streak_days ?? 0} />
        <div className="card-base p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">{user?.coins ?? 0}</p>
              <p className="text-xs text-muted">{t("dashboard.coins_earned")}</p>
            </div>
          </div>
          <Link to="/shop">
            <Button size="sm" variant="ghost" fullWidth>{t("dashboard.visit_shop")}</Button>
          </Link>
        </div>
      </div>

      {/* Progress overview */}
      {progressLoading ? (
        <SkeletonCard />
      ) : progress && (
        <div className="card-base p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-bold text-white text-sm sm:text-base">{t("dashboard.overall_progress")}</h2>
            <span className="text-xl sm:text-2xl font-black gradient-text">{progress.progress_pct}%</span>
          </div>
          <ProgressBar value={progress.progress_pct} size="lg" showPercent={false} />
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4 text-center">
            {[
              { label: t("dashboard.lessons_done"), value: progress.completed_lessons, icon: BookOpen },
              { label: t("dashboard.quizzes_passed"), value: progress.passed_quizzes, icon: Trophy },
              { label: t("dashboard.total_lessons"), value: progress.total_lessons, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-bright mx-auto mb-1" />
                <p className="text-base sm:text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] sm:text-xs text-muted leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next lessons + Leaderboard */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-sm sm:text-base">{t("dashboard.continue_learning")}</h2>
            <Link to="/lessons" className="text-xs sm:text-sm text-purple-bright hover:text-purple-light transition-colors flex items-center gap-1">
              {t("dashboard.view_all")} <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
          {lessonsLoading ? (
            <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>
          ) : nextLessons.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {nextLessons.map((lesson, i) => (
                <motion.div key={lesson.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/lessons/${lesson.slug}`} className="flex items-center gap-3 card-base p-3 sm:p-4 hover:border-purple-primary/50 transition-all duration-200 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-purple-bright transition-colors text-sm truncate">{lesson.title}</p>
                      <p className="text-xs text-muted">{lesson.difficulty} • {lesson.xp_reward} XP</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-bright transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card-base p-6 sm:p-8 text-center">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-purple-bright mx-auto mb-3" />
              <p className="text-white font-medium text-sm sm:text-base">{t("dashboard.all_completed")}</p>
              <p className="text-muted text-xs sm:text-sm">{t("dashboard.java_master")}</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-sm sm:text-base">{t("dashboard.top_players")}</h2>
            <Link to="/leaderboard" className="text-xs sm:text-sm text-purple-bright hover:text-purple-light transition-colors flex items-center gap-1">
              {t("dashboard.full_board")} <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="card-base p-3 sm:p-4 space-y-2 sm:space-y-3">
            {leaderboard?.slice(0, 5).map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-2 sm:gap-3">
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? "bg-yellow-500 text-yellow-900" : i === 1 ? "bg-gray-400 text-gray-800" : i === 2 ? "bg-amber-600 text-amber-100" : "bg-white/10 text-gray-400"}`}>
                  {i + 1}
                </span>
                <Avatar src={entry.avatar_url} name={entry.username} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white truncate">{entry.username}</p>
                  {entry.active_title && <p className="text-[10px] sm:text-xs" style={{ color: entry.active_title.color }}>{entry.active_title.name}</p>}
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-bright font-semibold">
                  <Zap className="w-3 h-3" />{entry.xp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
