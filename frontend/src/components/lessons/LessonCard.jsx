import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Lock, Zap } from "lucide-react";
import Badge from "@/components/ui/Badge";

const difficultyIcon = { beginner: "🟢", intermediate: "🟡", advanced: "🔴" };

export default function LessonCard({ lesson, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: "0 0 30px rgba(124,58,237,0.3)" }}
    >
      <Link to={`/lessons/${lesson.slug}`} className="block card-base p-4 transition-all duration-200 hover:border-purple-primary/50 group relative overflow-hidden">
        {/* Completed overlay */}
        {lesson.is_completed && (
          <div className="absolute top-0 right-0 w-0 h-0" style={{ borderLeft: "40px solid transparent", borderTop: "40px solid rgba(16,185,129,0.3)" }} />
        )}
        {lesson.is_completed && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-emerald-400" />}

        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-white group-hover:text-purple-bright transition-colors leading-snug flex-1">{lesson.title}</h3>
          {lesson.is_locked && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge difficulty={lesson.difficulty}>{difficultyIcon[lesson.difficulty]} {lesson.difficulty}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock className="w-3 h-3" />
            {lesson.duration_minutes}m
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-bright font-medium">
            <Zap className="w-3 h-3" />
            {lesson.xp_reward} XP
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
