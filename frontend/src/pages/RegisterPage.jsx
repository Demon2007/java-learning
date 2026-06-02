import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Code2, Eye, EyeOff, Lock, Mail, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import useAuthStore from "@/store/authStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const { register: registerUser, logout } = useAuth();
  const { isAuthenticated, user } = useAuthStore();
  const t = useT();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setError } = useForm();
  const password = watch("password");

  // If already logged in — show info instead of form
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center glow-purple">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black gradient-text">JavaQuest</span>
            </Link>
          </div>
          <div className="card-base p-7 glow-purple-sm text-center space-y-5">
            <p className="text-white font-bold text-lg">
              {t("auth.already_logged_in") || "Вы уже вошли как"} <span className="gradient-text">{user.username}</span>
            </p>
            <p className="text-muted text-sm">{t("auth.logout_to_register") || "Чтобы создать новый аккаунт, сначала выйдите."}</p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard">
                <Button fullWidth variant="secondary">{t("nav.dashboard")}</Button>
              </Link>
              <Button fullWidth variant="ghost" icon={LogOut} onClick={logout}>
                {t("nav.logout")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    await registerUser(data.username, data.email, data.password, setError);
  };

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #9333ea, transparent)" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center glow-purple">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black gradient-text">JavaQuest</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-5 mb-1">{t("auth.join_title")}</h1>
          <p className="text-muted">{t("auth.join_sub")}</p>
        </div>

        <div className="card-base p-6 sm:p-7 glow-purple-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t("auth.username")}
              placeholder={t("auth.username_placeholder")}
              icon={User}
              error={errors.username?.message}
              {...register("username", {
                required: t("auth.username_required"),
                minLength: { value: 3, message: t("auth.username_min") },
                maxLength: { value: 20, message: t("auth.username_max") },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: t("auth.username_pattern") },
              })}
            />
            <Input
              label={t("auth.email")}
              type="email"
              placeholder={t("auth.email_placeholder")}
              icon={Mail}
              error={errors.email?.message}
              {...register("email", {
                required: t("auth.email_required"),
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("auth.email_invalid") },
              })}
            />
            <Input
              label={t("auth.password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password_placeholder")}
              icon={Lock}
              error={errors.password?.message}
              iconRight={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register("password", {
                required: t("auth.password_required"),
                minLength: { value: 6, message: t("auth.password_min") },
              })}
            />
            <Input
              label={t("auth.confirm_password")}
              type="password"
              placeholder={t("auth.repeat_placeholder")}
              icon={Lock}
              error={errors.confirm?.message}
              {...register("confirm", {
                required: t("auth.confirm_required"),
                validate: (v) => v === password || t("auth.confirm_match"),
              })}
            />
            <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-2">
              {t("auth.register_btn")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              {t("auth.have_account")}{" "}
              <Link to="/login" className="text-purple-bright font-semibold hover:text-purple-light transition-colors">
                {t("auth.sign_in")}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
