import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Shield, Users, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const traders = [
  {
    id: "1",
    name: "FlipKingFC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    specialty: "Quick Flips",
    winRate: 94,
    avgROI: "+32%",
    subscribers: "4.2K",
    price: "£14.99",
    verified: true,
    featured: true,
  },
  {
    id: "2",
    name: "SBCMaster",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    specialty: "SBC Investments",
    winRate: 88,
    avgROI: "+28%",
    subscribers: "2.8K",
    price: "£9.99",
    verified: true,
    featured: false,
  },
  {
    id: "3",
    name: "MetaTraderPro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    specialty: "Meta Predictions",
    winRate: 91,
    avgROI: "+45%",
    subscribers: "5.1K",
    price: "£19.99",
    verified: true,
    featured: true,
  },
  {
    id: "4",
    name: "IconInvestor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    specialty: "Icon Trading",
    winRate: 86,
    avgROI: "+24%",
    subscribers: "1.9K",
    price: "£12.99",
    verified: true,
    featured: false,
  },
  {
    id: "5",
    name: "CoinKingFC",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
    specialty: "Market Analysis",
    winRate: 89,
    avgROI: "+35%",
    subscribers: "8.2K",
    price: "£17.99",
    verified: true,
    featured: true,
  },
  {
    id: "6",
    name: "FlipQueen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    specialty: "Budget Flips",
    winRate: 92,
    avgROI: "+22%",
    subscribers: "5.1K",
    price: "£7.99",
    verified: true,
    featured: false,
  },
];

const categories = ["All", "Quick Flips", "SBC", "Icons", "Meta", "Budget"];
const sortOptions = ["Popular", "Win Rate", "ROI", "Price: Low", "Price: High"];

const DiscoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTraders = traders.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Discover Traders</h1>
        <p className="text-muted-foreground">Find and follow the best FC26 trading experts</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search traders..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="flex-shrink-0"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredTraders.length} traders found</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured */}
      <div>
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-accent" />
          Featured Traders
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {filteredTraders.filter(t => t.featured).map((trader, index) => (
            <motion.div
              key={trader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-card border border-primary/30 rounded-2xl p-5 card-hover glow-primary"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={trader.avatar}
                    alt={trader.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-border"
                  />
                  {trader.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center">
                      <Shield className="w-3 h-3 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{trader.name}</h3>
                  <p className="text-sm text-primary">{trader.specialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <p className="font-bold text-foreground">{trader.winRate}%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <p className="font-bold text-success">{trader.avgROI}</p>
                  <p className="text-xs text-muted-foreground">Avg ROI</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <p className="font-bold text-foreground">{trader.subscribers}</p>
                  <p className="text-xs text-muted-foreground">Subs</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-xl text-foreground">{trader.price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                <Button variant="hero" size="sm">Subscribe</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Traders */}
      <div>
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          All Traders
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTraders.filter(t => !t.featured).map((trader, index) => (
            <motion.div
              key={trader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-5 card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={trader.avatar}
                    alt={trader.name}
                    className="w-12 h-12 rounded-xl object-cover border border-border"
                  />
                  {trader.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-gold flex items-center justify-center">
                      <Shield className="w-2 h-2 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{trader.name}</h3>
                  <p className="text-sm text-muted-foreground">{trader.specialty}</p>
                </div>
                <span className="text-sm text-success font-semibold">{trader.winRate}%</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    {trader.avgROI}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {trader.subscribers}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  {trader.price}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
