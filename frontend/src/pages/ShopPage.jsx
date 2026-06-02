import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Coins, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import shopService from "@/services/shop.service";
import useAuthStore from "@/store/authStore";
import { useT } from "@/hooks/useT";
import ShopItemCard from "@/components/shop/ShopItemCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ShopPage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const t = useT();
  const [activeTab, setActiveTab] = useState("all");
  const [confirmItem, setConfirmItem] = useState(null);

  const TABS = [
    { key: "all", label: t("shop.all") },
    { key: "title", label: t("shop.titles") },
    { key: "frame", label: t("shop.frames") },
  ];

  const { data: items, isLoading } = useQuery({
    queryKey: ["shop", activeTab],
    queryFn: () => shopService.getItems(activeTab === "all" ? null : activeTab).then(r => r.data.data),
  });

  const purchaseMutation = useMutation({
    mutationFn: (id) => shopService.purchase(id),
    onSuccess: (res) => {
      const data = res.data.data;
      toast.success(data.message);
      updateUser({ coins: data.coins_remaining });
      queryClient.invalidateQueries(["shop"]);
      queryClient.invalidateQueries(["profile"]);
      setConfirmItem(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Purchase failed.");
      setConfirmItem(null);
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{t("shop.title")}</h1>
          <p className="text-muted mt-1 text-sm">{t("shop.sub")}</p>
        </div>
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl"
          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          <span className="font-bold text-yellow-300 text-base sm:text-lg">{user?.coins ?? 0}</span>
          <span className="text-yellow-400/70 text-xs sm:text-sm hidden sm:block">{t("shop.coins")}</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.key ? "gradient-bg text-white glow-purple-sm" : "card-base text-muted hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items?.length === 0 ? (
        <div className="card-base p-12 sm:p-16 text-center">
          <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-purple-bright/30 mx-auto mb-4" />
          <p className="text-white font-medium text-sm sm:text-base">{t("shop.no_items")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {items?.map((item) => (
            <ShopItemCard key={item.id} item={item} userCoins={user?.coins ?? 0} onPurchase={setConfirmItem} />
          ))}
        </div>
      )}

      <Modal isOpen={!!confirmItem} onClose={() => setConfirmItem(null)} title={t("shop.confirm_title")}>
        {confirmItem && (
          <div className="space-y-4 sm:space-y-5">
            <div
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: confirmItem.frame_gradient || `${confirmItem.title_color || "#7c3aed"}20` }}
              >
                <span className="text-xs font-bold text-white">{confirmItem.name.slice(0, 2)}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-sm sm:text-base">{confirmItem.name}</p>
                <p className="text-xs sm:text-sm text-muted truncate">{confirmItem.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm">{t("shop.cost")}</span>
              <span className="flex items-center gap-1 font-bold text-yellow-400 text-base sm:text-lg"><Coins className="w-4 h-4 sm:w-5 sm:h-5" />{confirmItem.price_coins}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted text-sm">{t("shop.your_coins")}</span>
              <span className="flex items-center gap-1 font-semibold text-white text-sm"><Coins className="w-4 h-4 text-yellow-400" />{user?.coins ?? 0}</span>
            </div>
            <div className="flex items-center justify-between font-semibold border-t border-purple-primary/20 pt-3">
              <span className="text-muted text-sm">{t("shop.after")}</span>
              <span className="flex items-center gap-1 text-white text-sm"><Coins className="w-4 h-4 text-yellow-400" />{(user?.coins ?? 0) - confirmItem.price_coins}</span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button variant="secondary" fullWidth onClick={() => setConfirmItem(null)} size="sm">{t("shop.cancel")}</Button>
              <Button fullWidth loading={purchaseMutation.isPending} onClick={() => purchaseMutation.mutate(confirmItem.id)} icon={Coins} size="sm">
                {t("shop.buy_now")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
