import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Crown, Flame, Medal, RefreshCw, Zap } from "lucide-react";
import gamificationService from "@/services/gamification.service";
import useAuthStore from "@/store/authStore";
import { useT } from "@/hooks/useT";
import Avatar from "@/components/ui/Avatar";
import Skeleton from "@/components/ui/Skeleton";

const REFETCH_INTERVAL = 30; // seconds

const rankIcon = (rank) => {
  if (rank === 1) return <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
  return <span className="text-xs sm:text-sm font-bold text-gray-500">#{rank}</span>;
};

function PodiumCard({ entry, place, delay }) {
  const medals = ["👑", "🥈", "🥉"];
  const isFirst = place === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card-base p-3 sm:p-4 flex flex-col items-center text-center ${isFirst ? "glow-purple" : ""}`}
      style={
        isFirst
          ? { borderColor: "rgba(245,158,11,0.5)", background: "rgba(245,158,11,0.06)" }
          : place === 2
          ? { borderColor: "rgba(156,163,175,0.4)" }
          : { borderColor: "rgba(180,83,9,0.4)" }
      }
    >
      <p className={`mb-2 ${isFirst ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>{medals[place - 1]}</p>
      <div className="mb-2">
        <Avatar src={entry.avatar_url} name={entry.username} size={isFirst ? "lg" : "md"} />
      </div>
      <p className={`font-bold text-white truncate w-full ${isFirst ? "text-sm sm:text-base" : "text-xs sm:text-sm"}`}>{entry.username}</p>
      {entry.active_title && (
        <p className="text-[10px] sm:text-xs mt-0.5 truncate w-full" style={{ color: entry.active_title.color }}>
          {entry.active_title.name}
        </p>
      )}
      <p className={`font-bold mt-1 flex items-center justify-center gap-1 ${isFirst ? "text-yellow-400 text-sm sm:text-base" : "text-gray-300 text-xs sm:text-sm"}`}>
        <Zap className={isFirst ? "w-4 h-4" : "w-3 h-3"} />
        {entry.xp}{isFirst ? " XP" : ""}
      </p>
    </motion.div>
  );
}

// Countdown hook
function useCountdown(total) {
  const [count, setCount] = useState(total);
  useEffect(() => {
    setCount(total);
    const id = setInterval(() => setCount(c => (c <= 1 ? total : c - 1)), 1000);
    return () => clearInterval(id);
  }, [total]);
  return count;
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const t = useT();
  const [flashKey, setFlashKey] = useState(0);

  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => gamificationService.getLeaderboard().then(r => r.data),
    refetchInterval: REFETCH_INTERVAL * 1000,
    refetchOnWindowFocus: true,
  });

  const countdown = useCountdown(REFETCH_INTERVAL);

  // Flash animation when data updates
  useEffect(() => {
    if (dataUpdatedAt) setFlashKey(k => k + 1);
  }, [dataUpdatedAt]);

  const entries = data?.data || [];
  const currentRank = data?.meta?.current_user_rank;
  const top3 = entries.slice(0, 3);

  const updatedTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{t("leaderboard.title")}</h1>
          <p className="text-muted mt-1 text-sm">{t("leaderboard.sub")}</p>
          {currentRank && (
            <p className="text-purple-bright font-semibold mt-1 text-sm">
              {t("leaderboard.your_rank")} #{currentRank}
            </p>
          )}
        </div>

        {/* Live indicator + countdown */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {isFetching ? (
              <RefreshCw className="w-3.5 h-3.5 text-purple-bright animate-spin" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span className="text-xs font-semibold text-emerald-400">{t("leaderboard.live")}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500">
              {t("leaderboard.updated")}: {updatedTime || "—"}
            </p>
            <p className="text-[10px] text-gray-600">
              {isFetching ? "..." : `→ ${countdown}s`}
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {!isLoading && top3.length >= 3 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={flashKey}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 items-end"
          >
            <PodiumCard entry={top3[1]} place={2} delay={0.1} />
            <PodiumCard entry={top3[0]} place={1} delay={0} />
            <PodiumCard entry={top3[2]} place={3} delay={0.2} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Full table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`table-${flashKey}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="card-base overflow-hidden"
        >
          <div className="px-3 sm:px-4 py-3 border-b border-purple-primary/20 grid grid-cols-[auto_1fr_auto_auto] gap-2 sm:gap-4 text-xs text-muted uppercase tracking-wider">
            <span>{t("leaderboard.rank")}</span>
            <span>{t("leaderboard.player")}</span>
            <span className="hidden sm:block">{t("leaderboard.streak")}</span>
            <span>{t("leaderboard.xp")}</span>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array(10).fill(0).map((_, i) => <Skeleton key={i} variant="text" className="w-full h-12" />)}
            </div>
          ) : (
            <div className="divide-y divide-purple-primary/10">
              {entries.map((entry, i) => {
                const isCurrentUser = entry.id === user?.id;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 items-center transition-colors ${
                      isCurrentUser ? "bg-purple-primary/15 border-l-2 border-purple-primary" : "hover:bg-white/3"
                    }`}
                  >
                    <div className="w-6 sm:w-8 flex items-center justify-center">{rankIcon(entry.rank)}</div>
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <Avatar src={entry.avatar_url} name={entry.username} size="sm" />
                      <div className="min-w-0">
                        <p className={`font-semibold text-xs sm:text-sm truncate ${isCurrentUser ? "text-purple-bright" : "text-white"}`}>
                          {entry.username} {isCurrentUser && <span className="opacity-70 text-[10px]">{t("leaderboard.you")}</span>}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {entry.active_title && (
                            <span className="text-[10px] sm:text-xs hidden sm:block" style={{ color: entry.active_title.color }}>
                              {entry.active_title.name}
                            </span>
                          )}
                          <span className="text-[10px] sm:text-xs text-muted">Lv.{entry.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-sm text-orange-400">
                      <Flame className="w-3.5 h-3.5" />{entry.streak_days}
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-bright">
                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{entry.xp}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
