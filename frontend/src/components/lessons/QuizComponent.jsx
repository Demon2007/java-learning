import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, Coins, RefreshCw, XCircle, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import lessonsService from "@/services/lessons.service";
import useAuthStore from "@/store/authStore";
import useGameStore from "@/store/gameStore";

export default function QuizComponent({ quiz, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { updateUser } = useAuthStore();
  const { showLevelUp, queueAchievement } = useGameStore();

  const submitMutation = useMutation({
    mutationFn: (answersArr) => lessonsService.submitQuiz(quiz.id, answersArr),
    onSuccess: (res) => {
      const data = res.data.data;
      setResult(data);
      if (data.passed) {
        toast.success(`Quiz passed! +${data.xp_earned} XP +${data.coins_earned} Coins`);
        updateUser({ xp: undefined }); // trigger refetch
        if (data.leveled_up) showLevelUp(data.new_level);
        data.new_achievements?.forEach(a => queueAchievement(a));
        onComplete?.(data);
      } else {
        toast.error(`Score: ${data.score}%. Need 70% to pass.`);
      }
    },
    onError: () => toast.error("Failed to submit quiz."),
  });

  const handleSelect = (questionId, answerIndex) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = () => {
    const answersArr = quiz.questions.map(q => answers[q.id] ?? -1);
    if (answersArr.some(a => a === -1)) {
      toast.error("Please answer all questions first.");
      return;
    }
    submitMutation.mutate(answersArr);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Score card */}
        <div className={`card-base p-6 text-center border-2 ${result.passed ? "border-emerald-500/40" : "border-red-500/40"}`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black ${result.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {result.score}%
          </div>
          <h3 className={`text-xl font-bold mb-1 ${result.passed ? "text-emerald-300" : "text-red-300"}`}>
            {result.passed ? "Quiz Passed! 🎉" : "Not quite there..."}
          </h3>
          <p className="text-muted text-sm">{result.correct} of {result.total} correct answers</p>
          {result.passed && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-purple-bright font-semibold"><Zap className="w-4 h-4" /> +{result.xp_earned} XP</div>
              <div className="flex items-center gap-1 text-yellow-400 font-semibold"><Coins className="w-4 h-4" /> +{result.coins_earned}</div>
            </div>
          )}
        </div>

        {/* Answer review */}
        <div className="space-y-3">
          {result.results.map((r, i) => (
            <div key={i} className={`card-base p-4 border ${r.is_correct ? "border-emerald-500/30" : "border-red-500/30"}`}>
              <div className="flex items-start gap-3">
                {r.is_correct ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white mb-1">{r.question}</p>
                  {r.explanation && <p className="text-xs text-muted">{r.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleRetry} variant="secondary" icon={RefreshCw} fullWidth>
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">{quiz.title}</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-purple-bright font-medium">+{quiz.xp_reward} XP</span>
          <span className="text-yellow-400 font-medium">+{quiz.coin_reward} coins</span>
        </div>
      </div>

      {quiz.questions.map((question, qi) => (
        <div key={question.id} className="card-base p-5" style={{ background: "#1a1a35" }}>
          <p className="font-medium text-white mb-4">
            <span className="text-purple-bright mr-2">{qi + 1}.</span>
            {question.text}
          </p>
          <div className="space-y-2.5">
            {question.options.map((option, oi) => {
              const selected = answers[question.id] === oi;
              return (
                <motion.button
                  key={oi}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(question.id, oi)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                    selected
                      ? "border-purple-primary bg-purple-primary/20 text-purple-bright"
                      : "border-white/10 bg-white/3 text-gray-300 hover:border-purple-primary/50 hover:bg-purple-primary/10"
                  }`}
                >
                  <span className={`inline-flex w-6 h-6 rounded-full mr-2 items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-purple-primary text-white" : "bg-white/10"}`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      <Button
        onClick={handleSubmit}
        loading={submitMutation.isPending}
        fullWidth
        size="lg"
        disabled={Object.keys(answers).length < quiz.questions.length}
        icon={ChevronRight}
      >
        Submit Answers
      </Button>
    </div>
  );
}
