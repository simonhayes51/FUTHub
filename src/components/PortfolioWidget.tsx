import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Target, Trophy, Flame, Star, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const PortfolioWidget = () => {
  // Fetch portfolio data from API
  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => api.getPortfolio(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-card border border-destructive/50 rounded-2xl p-5">
        <p className="text-destructive text-sm">Failed to load portfolio</p>
      </div>
    );
  }

  // Extract portfolio stats from API data
  const portfolioData = {
    totalValue: portfolio?.totalValue?.toLocaleString() || "0",
    change: portfolio?.changePercent || "+0%",
    isUp: portfolio?.changePercent?.startsWith('+') || false,
    invested: portfolio?.totalInvested?.toLocaleString() || "0",
    profit: portfolio?.totalProfit?.toLocaleString() || "0",
    activeInvestments: portfolio?.activeCount || 0,
    winRate: portfolio?.winRate || 0,
  };

  const recentTrades = portfolio?.recentTrades || [];

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
          {recentTrades.length > 0 ? (
            recentTrades.map((trade: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm text-foreground">{trade.card?.name || trade.cardName || 'Unknown'}</span>
                <span className={`text-sm font-semibold ${(trade.profit || 0) >= 0 ? "text-success" : "text-destructive"}`}>
                  {trade.profit >= 0 ? '+' : ''}{trade.profit?.toLocaleString() || '0'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">No recent trades</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioWidget;
