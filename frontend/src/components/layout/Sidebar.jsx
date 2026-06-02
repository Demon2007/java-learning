import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Flame, LayoutDashboard, Package, ShoppingBag, Star, Trophy, User, X } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useT } from "@/hooks/useT";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";

const navKeys = [
  { to: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/lessons", icon: BookOpen, key: "lessons" },
  { to: "/leaderboard", icon: Trophy, key: "leaderboard" },
  { to: "/achievements", icon: Star, key: "achievements" },
  { to: "/shop", icon: ShoppingBag, key: "shop" },
  { to: "/inventory", icon: Package, key: "inventory" },
  { to: "/profile", icon: User, key: "profile" },
];

function SidebarContent({ onClose }) {
  const { user } = useAuthStore();
  const t = useT();

  return (
    <div className="flex flex-col h-full">
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="p-5 border-b border-purple-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={user?.avatar_url} name={user?.username} size="md" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{user?.username}</p>
            {user?.active_title && (
              <span className="text-xs font-medium" style={{ color: user.active_title.color }}>
                {user.active_title.name}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span>{t("common.level")} {user?.level}</span>
            <span>{user?.xp} XP</span>
          </div>
          <ProgressBar value={user?.xp_progress ?? 0} size="sm" showPercent={false} />
          <p className="text-xs text-muted text-right">{user?.xp_for_next_level} {t("nav.xp_next")}</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navKeys.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-purple-primary/20 text-purple-bright border border-purple-primary/40 glow-purple-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/6"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>

      {user?.streak_days > 0 && (
        <div className="p-4 border-t border-purple-primary/20">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-sm font-semibold text-orange-300">{user.streak_days} {t("common.days")}!</p>
              <p className="text-xs text-orange-400/70">{t("common.keep_up")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside
        className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 z-30 overflow-hidden"
        style={{ background: "rgba(15,15,26,0.95)", backdropFilter: "blur(16px)", borderRight: "1px solid rgba(124,58,237,0.15)" }}
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden overflow-hidden"
              style={{ background: "#0f0f1a", borderRight: "1px solid rgba(124,58,237,0.2)" }}
            >
              <div className="h-14 flex items-center px-5 border-b border-purple-primary/20">
                <span className="font-bold text-lg gradient-text">JavaQuest</span>
              </div>
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
