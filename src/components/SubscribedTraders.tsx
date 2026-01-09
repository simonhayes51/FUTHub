import { Shield, Plus, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Trader {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  isLive: boolean;
  specialty: string;
}

interface SubscribedTradersProps {
  traders: Trader[];
  activeTrader: string | null;
  onTraderSelect: (id: string | null) => void;
}

const SubscribedTraders = ({ traders, activeTrader, onTraderSelect }: SubscribedTradersProps) => {
  const [mutedTraders, setMutedTraders] = useState<string[]>([]);

  const toggleMute = (traderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMutedTraders(prev =>
      prev.includes(traderId)
        ? prev.filter(id => id !== traderId)
        : [...prev, traderId]
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Subscriptions</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="p-2">
        {/* All Posts Option */}
        <button
          onClick={() => onTraderSelect(null)}
          className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
            activeTrader === null
              ? "bg-primary/10 border border-primary/30"
              : "hover:bg-secondary/50"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ALL</span>
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">All Posts</p>
            <p className="text-xs text-muted-foreground">From all traders</p>
          </div>
        </button>

        {/* Trader List */}
        {traders.map((trader) => (
          <button
            key={trader.id}
            onClick={() => onTraderSelect(trader.id)}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors group ${
              activeTrader === trader.id
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-secondary/50"
            }`}
          >
            <div className="relative">
              <img
                src={trader.avatar}
                alt={trader.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
              {trader.isLive && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-card animate-pulse" />
              )}
              {trader.verified && !trader.isLive && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Shield className="w-2 h-2 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{trader.name}</p>
              <p className="text-xs text-muted-foreground">{trader.specialty}</p>
            </div>
            <button
              onClick={(e) => toggleMute(trader.id, e)}
              className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                mutedTraders.includes(trader.id)
                  ? "text-muted-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {mutedTraders.includes(trader.id) ? (
                <BellOff className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubscribedTraders;
