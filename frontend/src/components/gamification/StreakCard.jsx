import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function StreakCard({ days = 0 }) {
  const t = useT();
  return (
    <div className="card-base p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.3)" }}
      >
        <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
      </motion.div>
      <div>
        <p className="text-2xl sm:text-3xl font-black text-white">{days}</p>
        <p className="text-xs sm:text-sm font-medium text-orange-300">{t("common.streak")}</p>
        <p className="text-[10px] sm:text-xs text-muted">{t("common.keep_up")}</p>
      </div>
    </div>
  );
}
