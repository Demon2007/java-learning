import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap } from "lucide-react";
import useGameStore from "@/store/gameStore";

export default function LevelUpModal() {
  const { levelUpData, hideLevelUp } = useGameStore();

  useEffect(() => {
    if (levelUpData) {
      const timer = setTimeout(hideLevelUp, 4000);
      return () => clearTimeout(timer);
    }
  }, [levelUpData, hideLevelUp]);

  return (
    <AnimatePresence>
      {levelUpData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="text-center pointer-events-auto cursor-pointer"
            onClick={hideLevelUp}
          >
            <div className="relative">
              {/* Glow ring */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)" }}
              />
              <div className="relative card-base px-12 py-10 glow-purple-lg" style={{ borderColor: "rgba(168,85,247,0.6)" }}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center"
                  style={{ boxShadow: "0 0 50px rgba(124,58,237,0.8)" }}
                >
                  <Star className="w-10 h-10 text-white" fill="white" />
                </motion.div>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-purple-bright text-sm font-semibold uppercase tracking-widest mb-2"
                >
                  Level Up!
                </motion.p>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl font-black gradient-text mb-2"
                >
                  {levelUpData.level}
                </motion.h2>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-gray-300"
                >
                  <Zap className="w-4 h-4 text-purple-bright" />
                  <span>You reached level {levelUpData.level}!</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
