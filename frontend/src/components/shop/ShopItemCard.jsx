import { motion } from "framer-motion";
import { Check, Coins, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ShopItemCard({ item, onPurchase, userCoins = 0 }) {
  const canAfford = userCoins >= item.price_coins;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 0 30px rgba(124,58,237,0.3)" }}
      className="card-base p-5 flex flex-col gap-4 transition-all duration-200 hover:border-purple-primary/50"
    >
      {/* Preview */}
      <div className="w-full h-20 rounded-xl flex items-center justify-center text-center"
        style={item.frame_gradient ? { background: item.frame_gradient } : { background: `${item.title_color || "#7c3aed"}20`, border: `1px solid ${item.title_color || "#7c3aed"}40` }}
      >
        <span className="font-bold text-white text-sm px-2" style={{ color: item.title_color || "white" }}>
          {item.name}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-white text-sm">{item.name}</h3>
          {item.title_rarity && <Badge rarity={item.title_rarity} size="xs">{item.title_rarity}</Badge>}
        </div>
        <p className="text-xs text-muted">{item.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
          <Coins className="w-4 h-4" />
          <span>{item.price_coins}</span>
        </div>
        {item.is_owned ? (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5" /> Owned
          </span>
        ) : (
          <Button size="xs" disabled={!canAfford} onClick={() => onPurchase(item)} icon={canAfford ? Coins : Lock}>
            {canAfford ? "Buy" : "Need more coins"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
