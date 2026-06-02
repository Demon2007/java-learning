import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, ShoppingBag, Trophy, User } from "lucide-react";
import { useT } from "@/hooks/useT";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/lessons", icon: BookOpen, key: "lessons" },
  { to: "/leaderboard", icon: Trophy, key: "leaderboard" },
  { to: "/shop", icon: ShoppingBag, key: "shop" },
  { to: "/profile", icon: User, key: "profile" },
];

export default function MobileNav() {
  const t = useT();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: "rgba(15,15,26,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(124,58,237,0.18)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around px-1 py-1">
        {items.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-all duration-150 ${
                isActive ? "text-purple-bright" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? "bg-purple-primary/25" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">{t(`nav.${key}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
