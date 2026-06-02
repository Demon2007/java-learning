import { motion } from "framer-motion";

export default function ProgressBar({ value = 0, label, sublabel, size = "md", color = "purple", showPercent = true, animated = true }) {
  const heights = { xs: "h-1.5", sm: "h-2", md: "h-3", lg: "h-4" };
  const colors = {
    purple: "from-purple-primary to-purple-bright",
    gold: "from-yellow-500 to-amber-400",
    green: "from-emerald-500 to-green-400",
    blue: "from-blue-600 to-blue-400",
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-gray-300 font-medium">{label}</span>}
          {sublabel && <span className="text-xs text-muted">{sublabel}</span>}
          {showPercent && !sublabel && <span className="text-xs text-purple-bright font-semibold">{Math.round(value)}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/5 rounded-full overflow-hidden ${heights[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${heights[size]} bg-gradient-to-r ${colors[color]} rounded-full`}
          style={{ boxShadow: `0 0 8px rgba(124,58,237,0.5)` }}
        />
      </div>
    </div>
  );
}
