import { clsx } from "clsx";

export default function Skeleton({ className = "", variant = "text", count = 1 }) {
  const variants = {
    text: "h-4 rounded-lg",
    title: "h-7 rounded-lg",
    card: "h-48 rounded-2xl",
    avatar: "rounded-full aspect-square",
    button: "h-10 rounded-xl",
    wide: "h-6 rounded-lg w-full",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx("shimmer-bg", variants[variant], className)}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="card-base p-5 space-y-3">
      <Skeleton variant="title" className="w-3/4" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" className="w-24" />
        <Skeleton variant="button" className="w-20" />
      </div>
    </div>
  );
}
