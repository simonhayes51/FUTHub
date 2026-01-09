import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Target, Trophy, Flame, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PortfolioWidget = () => {
  const portfolioData = {
    totalValue: "4,250,000",
    change: "+12.5%",
    isUp: true,
    invested: "3,200,000",
    profit: "1,050,000",
    activeInvestments: 12,
    winRate: 87,
  };

  const recentTrades = [
    { card: "Mbappé", profit: "+180K", isWin: true },
    { card: "Haaland", profit: "+95K", isWin: true },
    { card: "Salah", profit: "-25K", isWin: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card border border-border rounded-2xl p-5 glow-primary"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Your Portfolio</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      {/* Total Value */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-1">Total Value</p>
        <div className="flex items-end gap-2">
          <span className="font-display text-3xl font-bold text-foreground">
            {portfolioData.totalValue}
          </span>
          <span className={`flex items-center gap-1 text-sm font-semibold pb-1 ${
            portfolioData.isUp ? "text-success" : "text-destructive"
          }`}>
            {portfolioData.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {portfolioData.change}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background/50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Target className="w-3 h-3" />
            <span className="text-xs">Invested</span>
          </div>
          <span className="font-semibold text-foreground">{portfolioData.invested}</span>
        </div>
        <div className="bg-background/50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-success mb-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">Profit</span>
          </div>
          <span className="font-semibold text-success">{portfolioData.profit}</span>
        </div>
        <div className="bg-background/50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="w-3 h-3" />
            <span className="text-xs">Active</span>
          </div>
          <span className="font-semibold text-foreground">{portfolioData.activeInvestments}</span>
        </div>
        <div className="bg-background/50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-accent mb-1">
            <Trophy className="w-3 h-3" />
            <span className="text-xs">Win Rate</span>
          </div>
          <span className="font-semibold text-foreground">{portfolioData.winRate}%</span>
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recent</p>
        <div className="space-y-2">
          {recentTrades.map((trade, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">{trade.card}</span>
              <span className={`text-sm font-semibold ${trade.isWin ? "text-success" : "text-destructive"}`}>
                {trade.profit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioWidget;
