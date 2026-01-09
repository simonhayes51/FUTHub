import { Search, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestedTraders = [
  {
    name: "CoinKingFC",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
    specialty: "Market Analysis",
    subscribers: "8.2K",
  },
  {
    name: "FlipQueen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    specialty: "Quick Flips",
    subscribers: "5.1K",
  },
  {
    name: "SBCGuru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    specialty: "SBC Solutions",
    subscribers: "12.4K",
  },
];

const trendingCards = [
  { name: "Mbappé", change: "+12%", isUp: true },
  { name: "Haaland", change: "+8%", isUp: true },
  { name: "Salah", change: "-5%", isUp: false },
];

const RightSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search traders, cards..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Trending Cards */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Trending Now</h3>
        </div>
        <div className="p-2">
          {trendingCards.map((card, index) => (
            <div
              key={index}
              className="p-3 rounded-xl hover:bg-secondary/50 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="font-medium text-foreground">{card.name}</span>
              <span className={`font-semibold ${card.isUp ? "text-success" : "text-destructive"}`}>
                {card.change}
              </span>
            </div>
          ))}
          <Button variant="ghost" className="w-full mt-2 text-primary">
            View All Trends
          </Button>
        </div>
      </div>

      {/* Suggested Traders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Suggested Traders</h3>
        </div>
        <div className="p-2">
          {suggestedTraders.map((trader, index) => (
            <div
              key={index}
              className="p-3 rounded-xl hover:bg-secondary/50 transition-colors flex items-center gap-3"
            >
              <img
                src={trader.avatar}
                alt={trader.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{trader.name}</p>
                <p className="text-xs text-muted-foreground">{trader.subscribers} subs</p>
              </div>
              <Button variant="outline" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-gradient-card border border-primary/30 rounded-2xl p-4 glow-primary">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground">Go Pro</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Unlock all traders and premium tools
        </p>
        <Button variant="hero" size="sm" className="w-full">
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default RightSidebar;
