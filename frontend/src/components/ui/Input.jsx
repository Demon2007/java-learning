import { forwardRef } from "react";
import { clsx } from "clsx";

const Input = forwardRef(({ label, error, icon: Icon, iconRight, className = "", type = "text", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full bg-white/5 border rounded-xl text-white placeholder:text-gray-500 transition-all duration-200",
            "focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 focus:bg-white/7",
            "py-3",
            Icon ? "pl-10 pr-4" : "px-4",
            iconRight ? "pr-10" : "",
            error ? "border-red-500/70 bg-red-500/5" : "border-purple-primary/25 hover:border-purple-primary/40",
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{iconRight}</div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
