import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useT } from "@/hooks/useT";
import ProgressBar from "@/components/ui/ProgressBar";

export default function XPBar({ user, compact = false }) {
  const t = useT();
  if (!user) return null;
  const progress = user.xp_progress ?? 0;
  const xpForNext = user.xp_for_next_level ?? 0;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-purple-bright font-semibold">
          <Zap className="w-3 h-3" />
          <span>Lv.{user.level}</span>
        </div>
        <div className="flex-1 min-w-[60px]">
          <ProgressBar value={progress} size="xs" showPercent={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-bg flex items-center justify-center glow-purple-sm"
          >
            <span className="font-black text-base sm:text-lg text-white">{user.level}</span>
          </motion.div>
          <div>
            <p className="font-bold text-white text-sm sm:text-base">{t("common.level")} {user.level}</p>
            <p className="text-xs text-muted">{user.xp} / {xpForNext} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl sm:text-2xl font-black gradient-text">{progress}%</p>
          <p className="text-xs text-muted">{t("nav.xp_next")}</p>
        </div>
      </div>
      <ProgressBar value={progress} size="md" showPercent={false} animated />
    </div>
  );
}
