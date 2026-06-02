import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Coins, Lock, Star, Zap } from "lucide-react";
import gamificationService from "@/services/gamification.service";
import { useT } from "@/hooks/useT";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";

function AchievementCard({ achievement, index }) {
  const t = useT();
  const earned = achievement.is_earned;
  const hidden = achievement.is_hidden && !earned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card-base p-4 sm:p-5 transition-all duration-200 ${earned ? "border-purple-primary/50 glow-purple-sm" : "opacity-60"}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${earned ? "gradient-bg glow-purple-sm" : "bg-white/5"}`}>
          {hidden ? <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" /> : <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${earned ? "text-white" : "text-gray-500"}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-xs sm:text-sm ${earned ? "text-white" : "text-gray-400"}`}>
            {hidden ? "???" : achievement.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted mt-0.5">
            {hidden ? t("achievements.hidden_desc") : achievement.description}
          </p>
          {earned && achievement.earned_at && (
            <p className="text-[10px] sm:text-xs text-purple-bright mt-1.5">
              {t("achievements.earned_on")} {new Date(achievement.earned_at).toLocaleDateString()}
            </p>
          )}
          {!hidden && (
            <div className="flex items-center gap-2 sm:gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-bright font-medium">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />+{achievement.xp_reward} XP
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-yellow-400 font-medium">
                <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" />+{achievement.coin_reward}
              </span>
            </div>
          )}
        </div>
        {earned && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />}
      </div>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const t = useT();
  const { data, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => gamificationService.getAchievements().then(r => r.data),
    refetchOnWindowFocus: true,
  });

  const achievements = data?.data || [];
  const earned = data?.meta?.earned || 0;
  const total = data?.meta?.total || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">{t("achievements.title")}</h1>
        <p className="text-muted mt-1 text-sm">{t("achievements.sub")}</p>
      </div>

      <div className="card-base p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-white text-sm sm:text-base">{t("achievements.progress")}</p>
          <p className="text-xl sm:text-2xl font-black gradient-text">{earned}/{total}</p>
        </div>
        <ProgressBar value={total > 0 ? (earned / total) * 100 : 0} size="md" showPercent />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      ) : (
        <>
          {earned > 0 && (
            <div>
              <h2 className="font-bold text-white mb-3 text-sm sm:text-base">{t("achievements.earned_section")} ({earned})</h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {achievements.filter(a => a.is_earned).map((a, i) => <AchievementCard key={a.id} achievement={a} index={i} />)}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-bold text-white mb-3 mt-4 text-sm sm:text-base">{t("achievements.locked_section")} ({total - earned})</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {achievements.filter(a => !a.is_earned).map((a, i) => <AchievementCard key={a.id} achievement={a} index={i} />)}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
