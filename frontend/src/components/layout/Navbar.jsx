import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code2, Coins, Globe, LogOut, Menu, Package, ShoppingBag, Star, Trophy, User, Zap } from "lucide-react";
import useAuthStore from "@/store/authStore";
import useLangStore from "@/store/langStore";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import Avatar from "@/components/ui/Avatar";

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuthStore();
  const { lang, toggle } = useLangStore();
  const { logout } = useAuth();
  const t = useT();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { to: "/profile", icon: User, key: "profile" },
    { to: "/inventory", icon: Package, key: "inventory" },
    { to: "/achievements", icon: Star, key: "achievements" },
    { to: "/leaderboard", icon: Trophy, key: "leaderboard" },
    { to: "/shop", icon: ShoppingBag, key: "shop" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-16 flex items-center px-3 sm:px-6"
      style={{ background: "rgba(15,15,26,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(124,58,237,0.18)" }}
    >
      {/* Mobile menu btn */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 mr-2"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 mr-4 sm:mr-8">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg gradient-bg flex items-center justify-center glow-purple-sm">
          <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className="font-bold text-base sm:text-lg gradient-text hidden sm:block">JavaQuest</span>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language toggle */}
        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold overflow-hidden"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)", color: "#c084fc" }}
          title="Switch language"
        >
          <Globe size={13} className="shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={lang}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="font-bold tracking-wide"
            >
              {lang === "en" ? "RU" : "EN"}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Coins (hidden on xs) */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
        >
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-300">{user?.coins ?? 0}</span>
        </div>

        {/* XP (hidden on xs) */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
        >
          <Zap className="w-4 h-4 text-purple-bright" />
          <span className="text-sm font-semibold text-purple-bright">{user?.xp ?? 0} XP</span>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Avatar src={user?.avatar_url} name={user?.username} size="sm" />
            <span className="hidden md:block text-sm font-medium text-gray-200 max-w-[90px] truncate">{user?.username}</span>
            <ChevronDown className={`hidden md:block w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 card-base py-1 glow-purple-sm z-50"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-3 border-b border-purple-primary/20">
                  <p className="text-sm font-semibold text-white">{user?.username}</p>
                  <p className="text-xs text-muted mt-0.5">{t("common.level")} {user?.level} • {user?.xp} XP</p>
                  {/* Coins on mobile (visible in dropdown) */}
                  <div className="flex items-center gap-1 mt-1 sm:hidden">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs text-yellow-300">{user?.coins ?? 0}</span>
                    <Zap className="w-3.5 h-3.5 text-purple-bright ml-2" />
                    <span className="text-xs text-purple-bright">{user?.xp ?? 0} XP</span>
                  </div>
                </div>
                {menuItems.map(({ to, icon: Icon, key }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/8 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-purple-bright" />
                    {t(`nav.${key}`)}
                  </Link>
                ))}
                <div className="border-t border-purple-primary/20 mt-1 pt-1">
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
