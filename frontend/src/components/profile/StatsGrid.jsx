import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Coins, Flame, Star, Zap } from "lucide-react";
import { useT } from "@/hooks/useT";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card-base p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
  >
    <div
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}20`, border: `1px solid ${color}40` }}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-lg sm:text-xl font-bold text-white">{value ?? 0}</p>
      <p className="text-[10px] sm:text-xs text-muted">{label}</p>
    </div>
  </motion.div>
);

export default function StatsGrid({ profile }) {
  const t = useT();
  if (!profile) return null;

  const stats = [
    { icon: Star, label: t("common.level"), value: profile.level, color: "#a855f7" },
    { icon: Zap, label: `${t("common.xp")}`, value: profile.xp, color: "#7c3aed" },
    { icon: Coins, label: t("common.coins"), value: profile.coins, color: "#f59e0b" },
    { icon: Flame, label: t("profile.stats.streak"), value: profile.streak_days, color: "#f97316" },
    { icon: BookOpen, label: t("profile.stats.lessons"), value: profile.lessons_completed, color: "#3b82f6" },
    { icon: CheckCircle, label: t("profile.stats.achievements"), value: profile.achievements_count, color: "#10b981" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.08} />)}
    </div>
  );
}
