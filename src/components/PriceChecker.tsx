import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Bell, Plus, History, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const recentSearches = ["Mbappé", "Icon Ronaldo", "TOTY Cards", "85 Fodder"];

const PriceChecker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  // Fetch trending cards from API
  const { data: trendingPlayers = [], isLoading, error } = useQuery({
    queryKey: ['cards', 'trending'],
    queryFn: () => api.getCards({ limit: 10 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch price alerts
  const { data: priceAlerts = [] } = useQuery({
    queryKey: ['price-alerts'],
    queryFn: () => api.getPriceAlerts(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Price Checker</h2>
            <p className="text-sm text-muted-foreground">Real-time market prices</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players, cards, consumables..."
            className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-lg"
          />
        </div>

        {/* Recent Searches */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <History className="w-4 h-4 text-muted-foreground" />
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(search)}
              className="px-3 py-1 rounded-full bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Players */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Trending Players</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="p-8 text-center text-destructive">
              <p>Failed to load trending players</p>
            </div>
          ) : trendingPlayers.length === 0 ? (
            // Empty state
            <div className="p-8 text-center text-muted-foreground">
              <p>No trending players available</p>
            </div>
          ) : (
            // Players
            trendingPlayers.map((player: any, index: number) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlayer(player)}
              className="w-full p-4 hover:bg-secondary/30 transition-colors flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold">
                {player.rating}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{player.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-bold">
                    {player.position}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{player.club} • {player.league}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-foreground">
                  {player.currentPrice?.toLocaleString() || '0'}
                </p>
                <p className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                  (player.priceChange || 0) >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {(player.priceChange || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {(player.priceChange || 0) >= 0 ? '+' : ''}{player.priceChange || 0}%
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </motion.button>
          ))
          )}
        </div>
      </div>

      {/* Price Alerts */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Your Price Alerts</h3>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Alert
          </Button>
        </div>

        <div className="space-y-3">
          {priceAlerts.length > 0 ? (
            priceAlerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">{alert.card?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">
                    Alert when {alert.alertType === 'PRICE_DROP' ? 'below' : 'above'} {alert.targetPrice?.toLocaleString()}
                  </p>
                </div>
                <span className={`text-sm ${alert.active ? 'text-success' : 'text-muted-foreground'}`}>
                  {alert.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No price alerts set</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceChecker;
