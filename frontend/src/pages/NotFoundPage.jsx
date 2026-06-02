import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Home } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-8xl font-black gradient-text">404</div>
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto glow-purple animate-float">
          <Code2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Lost in the code</h1>
        <p className="text-muted max-w-sm">This page doesn&apos;t exist. Even the best Java developers get a StackOverflowError sometimes.</p>
        <Link to="/dashboard">
          <Button icon={Home} size="lg">Back to Dashboard</Button>
        </Link>
      </motion.div>
    </div>
  );
}
