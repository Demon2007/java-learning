import { clsx } from "clsx";

const rarityStyles = {
  common: "bg-gray-700/50 text-gray-300 border-gray-600/50",
  rare: "bg-blue-900/50 text-blue-300 border-blue-500/50",
  epic: "bg-purple-900/50 text-purple-300 border-purple-500/50",
  legendary: "bg-orange-900/50 text-orange-300 border-orange-400/50",
};

const difficultyStyles = {
  beginner: "bg-green-900/40 text-green-300 border-green-600/40",
  intermediate: "bg-yellow-900/40 text-yellow-300 border-yellow-600/40",
  advanced: "bg-red-900/40 text-red-300 border-red-600/40",
};

const typeStyles = {
  default: "bg-purple-900/40 text-purple-300 border-purple-500/40",
  success: "bg-green-900/40 text-green-300 border-green-600/40",
  warning: "bg-yellow-900/40 text-yellow-300 border-yellow-600/40",
  danger: "bg-red-900/40 text-red-300 border-red-600/40",
  info: "bg-blue-900/40 text-blue-300 border-blue-500/40",
};

export default function Badge({ children, rarity, difficulty, type = "default", className = "", size = "sm" }) {
  const style = rarity ? rarityStyles[rarity] || rarityStyles.common
    : difficulty ? difficultyStyles[difficulty] || difficultyStyles.beginner
    : typeStyles[type] || typeStyles.default;

  return (
    <span className={clsx(
      "inline-flex items-center gap-1 rounded-full border font-medium",
      size === "xs" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
      style,
      className
    )}>
      {children}
    </span>
  );
}
