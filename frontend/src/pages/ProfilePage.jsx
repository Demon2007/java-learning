import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Calendar, Edit3, Save, Shield, X } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";
import { useT } from "@/hooks/useT";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatsGrid from "@/components/profile/StatsGrid";
import AvatarUpload from "@/components/profile/AvatarUpload";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, updateMutation } = useProfile();
  const t = useT();
  const [editMode, setEditMode] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm({
    values: { username: user?.username, bio: user?.bio },
  });
  const { register: regPw, handleSubmit: handlePw, reset: resetPw, watch: watchPw, formState: { errors: pwErrors } } = useForm();

  const onSaveProfile = async (data) => {
    await updateMutation.mutateAsync({ username: data.username, bio: data.bio });
    setEditMode(false);
  };

  const onChangePassword = async (data) => {
    try {
      const { default: authService } = await import("@/services/auth.service");
      await authService.changePassword(data);
      toast.success("Password changed!");
      setShowPwForm(false);
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    }
  };

  const displayUser = profile || user;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl font-black text-white">{t("profile.title")}</h1>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Avatar + basic info */}
        <div className="md:col-span-1 space-y-3 sm:space-y-4">
          <div className="card-base p-5 sm:p-6 flex flex-col items-center text-center">
            <AvatarUpload />
            <div className="mt-4 space-y-1">
              <h2 className="font-bold text-lg sm:text-xl text-white">{displayUser?.username}</h2>
              {displayUser?.active_title && (
                <p className="text-xs sm:text-sm font-medium" style={{ color: displayUser.active_title.color }}>
                  {displayUser.active_title.name}
                </p>
              )}
              {displayUser?.bio && <p className="text-xs sm:text-sm text-muted mt-2">{displayUser.bio}</p>}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted mt-2">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {t("profile.joined")} {new Date(displayUser?.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="card-base p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium text-white">{t("common.level")} {displayUser?.level}</p>
              <p className="text-xs text-muted">{displayUser?.xp} XP</p>
            </div>
            <ProgressBar value={displayUser?.xp_progress ?? 0} size="md" showPercent sublabel={`${displayUser?.xp_for_next_level} ${t("profile.xp_next")}`} />
          </div>
        </div>

        {/* Right: Edit form + stats */}
        <div className="md:col-span-2 space-y-3 sm:space-y-4">
          <div className="card-base p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm sm:text-base">{t("profile.edit_profile")}</h3>
              <Button
                size="xs"
                variant={editMode ? "ghost" : "secondary"}
                icon={editMode ? X : Edit3}
                onClick={() => { setEditMode(!editMode); if (editMode) resetProfile(); }}
              >
                {editMode ? t("profile.cancel") : t("profile.edit")}
              </Button>
            </div>
            {editMode ? (
              <form onSubmit={handleProfile(onSaveProfile)} className="space-y-4">
                <Input
                  label={t("profile.username")}
                  error={profileErrors.username?.message}
                  {...regProfile("username", { required: true, minLength: { value: 3, message: t("profile.username_min") } })}
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">{t("profile.bio")}</label>
                  <textarea
                    className="w-full bg-white/5 border border-purple-primary/25 rounded-xl text-white placeholder:text-gray-500 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 resize-none"
                    rows={3}
                    placeholder={t("profile.bio_placeholder")}
                    {...regProfile("bio")}
                  />
                </div>
                <Button type="submit" icon={Save} loading={updateMutation.isPending} size="sm">{t("profile.save")}</Button>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted mb-0.5">{t("profile.username")}</p>
                  <p className="text-white font-medium text-sm">{displayUser?.username}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">{t("profile.email")}</p>
                  <p className="text-white font-medium text-sm">{displayUser?.email}</p>
                </div>
                {displayUser?.bio && (
                  <div>
                    <p className="text-xs text-muted mb-0.5">{t("profile.bio")}</p>
                    <p className="text-white text-xs sm:text-sm">{displayUser.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <StatsGrid profile={displayUser} />

          <div className="card-base p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-bright" />
                <h3 className="font-bold text-white text-sm sm:text-base">{t("profile.security")}</h3>
              </div>
              <Button size="xs" variant="ghost" onClick={() => setShowPwForm(!showPwForm)}>
                {showPwForm ? t("profile.cancel") : t("profile.change_password")}
              </Button>
            </div>
            {showPwForm && (
              <form onSubmit={handlePw(onChangePassword)} className="space-y-3">
                <Input label={t("profile.current_password")} type="password" error={pwErrors.old_password?.message} {...regPw("old_password", { required: true })} />
                <Input label={t("profile.new_password")} type="password" error={pwErrors.new_password?.message} {...regPw("new_password", { required: true, minLength: { value: 6, message: "Min 6 chars" } })} />
                <Input
                  label={t("profile.confirm_password")}
                  type="password"
                  error={pwErrors.confirm_password?.message}
                  {...regPw("confirm_password", { validate: v => v === watchPw("new_password") || t("profile.pw_match") })}
                />
                <Button type="submit" size="sm">{t("profile.update_password")}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
