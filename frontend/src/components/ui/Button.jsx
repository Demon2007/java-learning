import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

const variants = {
  primary: "bg-gradient-to-r from-purple-primary to-purple-light text-white hover:from-purple-light hover:to-purple-bright shadow-lg hover:shadow-purple-primary/40 border border-purple-primary/30",
  secondary: "glass text-white hover:bg-white/10 hover:border-purple-bright/50",
  ghost: "text-purple-bright hover:bg-purple-primary/10 border border-transparent hover:border-purple-primary/30",
  danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg hover:shadow-red-500/30",
  outline: "border border-purple-primary/50 text-purple-bright hover:bg-purple-primary/10",
};

const sizes = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
  xl: "px-9 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  className = "",
  onClick,
  type = "button",
  fullWidth = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer select-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
      {iconRight && !loading && <iconRight className="w-4 h-4" />}
    </motion.button>
  );
}
