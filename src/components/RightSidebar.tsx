import { Search, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const RightSidebar = () => {
  // Fetch featured traders
  const { data: traders = [], isLoading: loadingTraders } = useQuery({
    queryKey: ['traders', 'featured'],
    queryFn: () => api.getTraders({ featured: true }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch trending cards from trending API
  const { data: trendingData, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending', 'cards'],
    queryFn: () => api.getTrendingCardsV2({ limit: 3, direction: 'all' }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const suggestedTraders = traders.slice(0, 3).map((t: any) => ({
    id: t.id,
    name: t.user?.username || t.displayName,
    avatar: t.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    specialty: t.specialty,
    subscribers: t.subscriberCount ? `${(t.subscriberCount / 1000).toFixed(1)}K` : '0',
  }));

  const trendingCards = trendingData?.cards?.slice(0, 3).map((card: any) => ({
    name: card.name,
    change: `${card.priceChangePercent > 0 ? '+' : ''}${card.priceChangePercent.toFixed(1)}%`,
    isUp: card.priceChangePercent > 0,
  })) || [];
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
          {loadingTrending ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </>
          ) : trendingCards.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No trending cards available
            </div>
          )}
        </div>
      </div>

      {/* Suggested Traders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Suggested Traders</h3>
        </div>
        <div className="p-2">
          {loadingTraders ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
              ))}
            </>
          ) : suggestedTraders.length > 0 ? (
            suggestedTraders.map((trader, index) => (
              <div
                key={trader.id || index}
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
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No suggested traders available
            </div>
          )}
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
