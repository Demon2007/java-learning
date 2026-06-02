import { useState } from "react"; // needed for showPassword
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Code2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const { login } = useAuth();
  const t = useT();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #2563eb, transparent)" }} />
        <div className="absolute inset-0 opacity-3" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center glow-purple">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black gradient-text">JavaQuest</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-5 mb-1">{t("auth.welcome_title")}</h1>
          <p className="text-muted">{t("auth.welcome_sub")}</p>
        </div>

        <div className="card-base p-6 sm:p-7 glow-purple-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t("auth.email_or_username")}
              type="text"
              placeholder={t("auth.email_or_username_placeholder")}
              icon={Mail}
              error={errors.email?.message}
              {...register("email", {
                required: t("auth.email_required"),
              })}
            />
            <Input
              label={t("auth.password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.pw_placeholder")}
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
            <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-2">
              {t("auth.login_btn")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              {t("auth.no_account")}{" "}
              <Link to="/register" className="text-purple-bright font-semibold hover:text-purple-light transition-colors">
                {t("auth.create_free")}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
