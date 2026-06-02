import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Filter, Lock, Search } from "lucide-react";
import lessonsService from "@/services/lessons.service";
import { useT } from "@/hooks/useT";
import LessonCard from "@/components/lessons/LessonCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import ProgressBar from "@/components/ui/ProgressBar";
import Input from "@/components/ui/Input";

export default function LessonsPage() {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => lessonsService.getCategories().then(r => r.data.data),
    staleTime: 60000,
  });

  const diffOptions = [
    { key: "all", label: t("lessons.all") },
    { key: "beginner", label: t("lessons.beginner") },
    { key: "intermediate", label: t("lessons.intermediate") },
    { key: "advanced", label: t("lessons.advanced") },
  ];

  const filtered = (categories || [])
    .filter(cat => !activeCategory || cat.id === activeCategory)
    .map(cat => ({
      ...cat,
      modules: cat.modules.map(m => ({
        ...m,
        lessons: m.lessons.filter(l => {
          const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
          const matchDiff = diffFilter === "all" || l.difficulty === diffFilter;
          return matchSearch && matchDiff;
        }),
      })).filter(m => m.lessons.length > 0),
    })).filter(cat => cat.modules.length > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">{t("lessons.title")}</h1>
        <p className="text-muted mt-1 text-sm">{t("lessons.sub")}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder={t("lessons.search")}
            icon={Search}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
          {diffOptions.map(d => (
            <button
              key={d.key}
              onClick={() => setDiffFilter(d.key)}
              className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
                diffFilter === d.key ? "gradient-bg text-white glow-purple-sm" : "card-base text-muted hover:text-white"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      {!isLoading && categories && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
              !activeCategory ? "gradient-bg text-white glow-purple-sm" : "card-base text-muted hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("lessons.all_categories")}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                activeCategory === cat.id ? "gradient-bg text-white glow-purple-sm" : "card-base text-muted hover:text-white"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] sm:text-xs opacity-70">{cat.completed_lessons}/{cat.total_lessons}</span>
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-base p-12 sm:p-16 text-center">
          <Filter className="w-10 h-10 sm:w-12 sm:h-12 text-purple-bright/40 mx-auto mb-4" />
          <p className="text-white font-medium text-sm sm:text-base">{t("lessons.no_results")}</p>
          <p className="text-muted text-xs sm:text-sm">{t("lessons.no_results_sub")}</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {filtered.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: cat.color }} />
                </div>
                <h2 className="font-bold text-white text-base sm:text-lg">{cat.name}</h2>
                <span className="text-[10px] sm:text-xs text-muted">{cat.completed_lessons}/{cat.total_lessons} {t("lessons.completed")}</span>
              </div>

              {cat.modules.map(module => (
                <div key={module.id} className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 pl-1">
                    {module.is_locked && <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />}
                    <h3 className="font-semibold text-gray-200 text-sm sm:text-base">{module.title}</h3>
                    <div className="flex-1 max-w-24 sm:max-w-32">
                      <ProgressBar value={module.lessons_count > 0 ? (module.completed_count / module.lessons_count) * 100 : 0} size="xs" showPercent={false} />
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted">{module.completed_count}/{module.lessons_count}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {module.lessons.map((lesson, i) => (
                      <LessonCard key={lesson.id} lesson={lesson} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
