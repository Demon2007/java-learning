import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Crown, Frame, Star } from "lucide-react";
import toast from "react-hot-toast";
import gamificationService from "@/services/gamification.service";
import useAuthStore from "@/store/authStore";
import { useT } from "@/hooks/useT";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function InventoryPage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const t = useT();
  const [activeTab, setActiveTab] = useState("titles");

  const TABS = [
    { key: "titles", label: t("inventory.titles_tab"), icon: Crown },
    { key: "frames", label: t("inventory.frames_tab"), icon: Frame },
  ];

  const { data: titles, isLoading: titlesLoading } = useQuery({
    queryKey: ["myTitles"],
    queryFn: () => gamificationService.getUserTitles().then(r => r.data.data),
  });

  const { data: frames, isLoading: framesLoading } = useQuery({
    queryKey: ["myFrames"],
    queryFn: () => gamificationService.getUserFrames().then(r => r.data.data),
  });

  const activateTitleMutation = useMutation({
    mutationFn: gamificationService.setActiveTitle,
    onSuccess: (res, id) => {
      const title = titles?.find(t => t.id === id);
      toast.success(`"${title?.name}" activated!`);
      queryClient.invalidateQueries(["myTitles"]);
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const removeTitleMutation = useMutation({
    mutationFn: gamificationService.removeTitle,
    onSuccess: () => {
      toast.success("Title removed.");
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const activateFrameMutation = useMutation({
    mutationFn: gamificationService.setActiveFrame,
    onSuccess: () => {
      toast.success("Frame activated!");
      queryClient.invalidateQueries(["myFrames"]);
      queryClient.invalidateQueries(["profile"]);
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">{t("inventory.title")}</h1>
        <p className="text-muted mt-1 text-sm">{t("inventory.sub")}</p>
      </div>

      <div className="flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === tab.key ? "gradient-bg text-white glow-purple-sm" : "card-base text-muted hover:text-white"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "titles" && (
        <div>
          {user?.active_title && (
            <div className="card-base p-3 sm:p-4 mb-4 flex items-center justify-between" style={{ borderColor: "rgba(124,58,237,0.5)" }}>
              <div>
                <p className="text-xs text-muted mb-0.5">{t("inventory.active_title")}</p>
                <p className="font-bold text-base sm:text-lg" style={{ color: user.active_title.color }}>{user.active_title.name}</p>
              </div>
              <Button size="xs" variant="ghost" onClick={() => removeTitleMutation.mutate()}>{t("inventory.remove")}</Button>
            </div>
          )}
          {titlesLoading ? (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} variant="card" />)}
            </div>
          ) : titles?.length === 0 ? (
            <div className="card-base p-12 sm:p-16 text-center">
              <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-purple-bright/30 mx-auto mb-4" />
              <p className="text-white font-medium text-sm sm:text-base">{t("inventory.no_titles")}</p>
              <p className="text-muted text-xs sm:text-sm">{t("inventory.no_titles_sub")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {titles?.map((title, i) => (
                <motion.div
                  key={title.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`card-base p-4 sm:p-5 transition-all ${title.is_active ? "border-purple-primary/60 glow-purple-sm" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm">{title.name}</h3>
                        {title.is_active && (
                          <span className="text-xs bg-purple-primary/30 text-purple-bright px-2 py-0.5 rounded-full">
                            {t("inventory.active")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">{title.description}</p>
                    </div>
                    <Badge rarity={title.rarity} size="xs">{title.rarity}</Badge>
                  </div>
                  <div className="h-1.5 w-full rounded-full mb-3" style={{ background: `${title.color}30` }}>
                    <div className="h-full rounded-full" style={{ width: "100%", background: title.color }} />
                  </div>
                  {!title.is_active && (
                    <Button size="xs" variant="secondary" className="w-full" onClick={() => activateTitleMutation.mutate(title.id)} loading={activateTitleMutation.isPending} icon={Check}>
                      {t("inventory.equip")}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "frames" && (
        <div>
          {framesLoading ? (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} variant="card" />)}
            </div>
          ) : frames?.length === 0 ? (
            <div className="card-base p-12 sm:p-16 text-center">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-purple-bright/30 mx-auto mb-4" />
              <p className="text-white font-medium text-sm sm:text-base">{t("inventory.no_frames")}</p>
              <p className="text-muted text-xs sm:text-sm">{t("inventory.no_frames_sub")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {frames?.map((frame, i) => (
                <motion.div
                  key={frame.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`card-base p-4 sm:p-5 ${frame.is_active ? "border-purple-primary/60 glow-purple-sm" : ""}`}
                >
                  <div className="w-full h-12 sm:h-16 rounded-xl mb-3" style={{ background: frame.css_gradient }} />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{frame.name}</h3>
                      {frame.is_active && <span className="text-xs text-purple-bright">{t("inventory.active")}</span>}
                    </div>
                    {!frame.is_active && (
                      <Button size="xs" variant="secondary" onClick={() => activateFrameMutation.mutate(frame.id)} loading={activateFrameMutation.isPending} icon={Check}>
                        {t("inventory.equip")}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
