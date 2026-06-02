import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Card({ children, className = "", hover = false, glow = false, onClick, animate = true }) {
  const Comp = animate ? motion.div : "div";
  const animProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    ...(hover && { whileHover: { y: -3, boxShadow: "0 0 30px rgba(124,58,237,0.35)" } }),
  } : {};

  return (
    <Comp
      onClick={onClick}
      {...animProps}
      className={clsx(
        "card-base p-5",
        hover && "cursor-pointer transition-all duration-200 hover:border-purple-primary/50",
        glow && "glow-purple",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}
