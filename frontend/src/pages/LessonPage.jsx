import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Coins, HelpCircle, Zap } from "lucide-react";
import toast from "react-hot-toast";
import lessonsService from "@/services/lessons.service";
import authService from "@/services/auth.service";
import useAuthStore from "@/store/authStore";
import useGameStore from "@/store/gameStore";
import LessonContent from "@/components/lessons/LessonContent";
import CodeEditor from "@/components/lessons/CodeEditor";
import QuizComponent from "@/components/lessons/QuizComponent";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function LessonPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showLevelUp, queueAchievement } = useGameStore();
  const queryClient = useQueryClient();
  const [showQuiz, setShowQuiz] = useState(false);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", slug],
    queryFn: () => lessonsService.getLesson(slug).then(r => r.data.data),
  });

  const completeMutation = useMutation({
    mutationFn: () => lessonsService.completeLesson(lesson.id),
    onSuccess: async (res) => {
      const data = res.data.data;
      if (!data.already_completed) {
        toast.success(`+${data.xp} XP +${data.coins} Coins!`);
        if (data.leveled_up) showLevelUp(data.new_level);
        data.new_achievements?.forEach(a => queueAchievement(a));
        queryClient.invalidateQueries({ queryKey: ["lesson", slug] });
        queryClient.invalidateQueries({ queryKey: ["progress"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        // Update Zustand user so Navbar/Sidebar reflect new XP+coins immediately
        try {
          const profileRes = await authService.getProfile();
          setUser(profileRes.data.data);
        } catch {}
      } else {
        toast("Already completed!", { icon: "✅" });
      }
    },
  });

  if (isLoading) return (
    <div className="space-y-6">
      <SkeletonCard />
      <div className="grid md:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
    </div>
  );

  if (!lesson) return (
    <div className="text-center py-20">
      <p className="text-white font-medium">Lesson not found.</p>
      <Link to="/lessons"><Button variant="ghost" className="mt-4">Back to Lessons</Button></Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-5">
        <Link to="/lessons" className="hover:text-purple-bright transition-colors">Lessons</Link>
        <span>/</span>
        <span className="text-gray-300">{lesson.module_title}</span>
        <span>/</span>
        <span className="text-white">{lesson.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          <div className="card-base p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-black text-white leading-tight">{lesson.title}</h1>
              {lesson.is_completed && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium flex-shrink-0">
                  <CheckCircle className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge difficulty={lesson.difficulty}>{lesson.difficulty}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted"><Clock className="w-3.5 h-3.5" />{lesson.duration_minutes} min</div>
              <div className="flex items-center gap-1 text-xs text-purple-bright font-medium"><Zap className="w-3.5 h-3.5" />{lesson.xp_reward} XP</div>
              <div className="flex items-center gap-1 text-xs text-yellow-400 font-medium"><Coins className="w-3.5 h-3.5" />{lesson.coin_reward} Coins</div>
            </div>
            <LessonContent content={lesson.content} />
          </div>

          {/* Code editor */}
          {lesson.code_example && (
            <div className="card-base p-5">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-bright">{"</>"}</span> Code Example
              </h2>
              <CodeEditor initialCode={lesson.code_example} />
            </div>
          )}

          {/* Quiz */}
          {lesson.quiz && (
            <div className="card-base p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-bright" /> Knowledge Quiz
                </h2>
                {!showQuiz && (
                  <Button size="sm" onClick={() => setShowQuiz(true)}>Start Quiz</Button>
                )}
              </div>
              {showQuiz && <QuizComponent quiz={lesson.quiz} onComplete={() => { queryClient.invalidateQueries(["progress"]); }} />}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Complete button */}
          <Button
            fullWidth
            size="lg"
            onClick={() => completeMutation.mutate()}
            loading={completeMutation.isPending}
            disabled={lesson.is_completed}
            variant={lesson.is_completed ? "secondary" : "primary"}
            icon={lesson.is_completed ? CheckCircle : Zap}
          >
            {lesson.is_completed ? "Completed!" : "Mark Complete"}
          </Button>

          {/* Lesson info */}
          <div className="card-base p-4 space-y-3">
            <h3 className="font-semibold text-white text-sm">Lesson Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Category</span><span className="text-white">{lesson.category_name}</span></div>
              <div className="flex justify-between"><span className="text-muted">Module</span><span className="text-white truncate max-w-[120px] text-right">{lesson.module_title}</span></div>
              <div className="flex justify-between"><span className="text-muted">Duration</span><span className="text-white">{lesson.duration_minutes} min</span></div>
              <div className="flex justify-between"><span className="text-muted">Difficulty</span><Badge difficulty={lesson.difficulty} size="xs">{lesson.difficulty}</Badge></div>
              <div className="flex justify-between"><span className="text-muted">XP Reward</span><span className="text-purple-bright font-semibold">{lesson.xp_reward}</span></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="card-base p-4 space-y-2">
            <h3 className="font-semibold text-white text-sm mb-3">Navigation</h3>
            {lesson.prev_lesson && (
              <Link to={`/lessons/${lesson.prev_lesson.slug}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{lesson.prev_lesson.title}</span>
              </Link>
            )}
            {lesson.next_lesson && (
              <Link to={`/lessons/${lesson.next_lesson.slug}`} className="flex items-center gap-2 text-sm text-purple-bright hover:text-purple-light transition-colors p-2 rounded-lg hover:bg-purple-primary/10">
                <span className="flex-1 truncate">{lesson.next_lesson.title}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
