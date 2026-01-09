import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, Bell, Plus, History, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const trendingPlayers = [
  { name: "Kylian Mbappé", rating: 97, price: "1.25M", change: "+15%", isUp: true, image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop" },
  { name: "Erling Haaland", rating: 96, price: "890K", change: "+8%", isUp: true, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop" },
  { name: "Jude Bellingham", rating: 95, price: "1.8M", change: "-3%", isUp: false, image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&h=100&fit=crop" },
  { name: "Vinícius Jr", rating: 95, price: "2.1M", change: "+12%", isUp: true, image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop" },
];

const recentSearches = ["Mbappé", "Icon Ronaldo", "TOTY Cards", "85 Fodder"];

const PriceChecker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<typeof trendingPlayers[0] | null>(null);

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
          {trendingPlayers.map((player, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlayer(player)}
              className="w-full p-4 hover:bg-secondary/30 transition-colors flex items-center gap-4"
            >
              <img
                src={player.image}
                alt={player.name}
                className="w-14 h-14 rounded-xl object-cover border border-border"
              />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{player.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-bold">
                    {player.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Current Price</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-lg text-foreground">{player.price}</p>
                <p className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                  player.isUp ? "text-success" : "text-destructive"
                }`}>
                  {player.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {player.change}
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
          ))}
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
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <div>
              <p className="font-medium text-foreground">Mbappé</p>
              <p className="text-sm text-muted-foreground">Alert when below 1.2M</p>
            </div>
            <span className="text-sm text-success">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <div>
              <p className="font-medium text-foreground">Haaland</p>
              <p className="text-sm text-muted-foreground">Alert when above 950K</p>
            </div>
            <span className="text-sm text-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChecker;
