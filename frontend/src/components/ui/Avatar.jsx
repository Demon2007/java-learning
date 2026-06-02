import { clsx } from "clsx";

const sizes = {
  xs: "w-7 h-7 text-xs",
  sm: "w-9 h-9 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-3xl",
  "2xl": "w-32 h-32 text-4xl",
};

export default function Avatar({ src, name = "?", size = "md", frame, className = "" }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : "?";

  const frameStyle = frame ? { background: frame.css_gradient } : {};

  return (
    <div
      className={clsx("relative flex-shrink-0", className)}
      style={frame ? { padding: "3px", borderRadius: "50%", ...frameStyle } : {}}
    >
      <div className={clsx("rounded-full overflow-hidden flex items-center justify-center", sizes[size],
        frame ? "bg-deep" : "bg-gradient-to-br from-purple-primary to-purple-bright"
      )}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-white">{initials}</span>
        )}
      </div>
    </div>
  );
}
