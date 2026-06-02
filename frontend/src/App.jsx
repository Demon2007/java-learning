import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/authStore";

import AppLayout from "@/components/layout/AppLayout";
import LevelUpModal from "@/components/gamification/LevelUpModal";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import LessonsPage from "@/pages/LessonsPage";
import LessonPage from "@/pages/LessonPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import AchievementsPage from "@/pages/AchievementsPage";
import ShopPage from "@/pages/ShopPage";
import InventoryPage from "@/pages/InventoryPage";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: true,
    },
  },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#151528",
              color: "#f0f0ff",
              border: "1px solid rgba(124,58,237,0.35)",
              borderRadius: "12px",
              fontSize: "14px",
              boxShadow: "0 0 20px rgba(124,58,237,0.2)",
              maxWidth: "90vw",
            },
            success: { iconTheme: { primary: "#a855f7", secondary: "#0f0f1a" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#0f0f1a" } },
          }}
        />
        <LevelUpModal />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/:slug" element={<LessonPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
