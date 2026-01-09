import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Users, Star, Calendar, ExternalLink, MessageCircle, Share2, Crown, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TraderProfileProps {
  trader?: {
    id: string;
    name: string;
    avatar: string;
    cover: string;
    bio: string;
    specialty: string;
    verified: boolean;
    stats: {
      subscribers: string;
      winRate: number;
      avgROI: string;
      totalTrades: number;
      joinedDate: string;
    };
    pricing: {
      monthly: string;
      yearly: string;
      yearlyDiscount: string;
    };
    badges: string[];
    isSubscribed: boolean;
  };
}

const defaultTrader = {
  id: "1",
  name: "FlipKingFC",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  cover: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&h=400&fit=crop",
  bio: "Elite FC26 trader with 5+ years experience. Specializing in quick flips, market timing, and SBC investments. Join the winning team! 🏆",
  specialty: "Quick Flips & Sniping",
  verified: true,
  stats: {
    subscribers: "4,250",
    winRate: 94,
    avgROI: "+32%",
    totalTrades: 1847,
    joinedDate: "Jan 2022",
  },
  pricing: {
    monthly: "£14.99",
    yearly: "£119.99",
    yearlyDiscount: "33%",
  },
  badges: ["Top Performer", "Verified Pro", "1K Club"],
  isSubscribed: false,
};

const TraderProfile = ({ trader = defaultTrader }: TraderProfileProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="space-y-4">
      {/* Cover & Avatar */}
      <div className="relative">
        <div className="h-48 rounded-2xl overflow-hidden">
          <img
            src={trader.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="relative">
            <img
              src={trader.avatar}
              alt={trader.name}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-background shadow-elevated"
            />
            {trader.verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center glow-gold">
                <Shield className="w-4 h-4 text-accent-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button variant="glass" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button variant="glass" size="sm">
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              {trader.name}
              <Crown className="w-5 h-5 text-accent" />
            </h1>
            <p className="text-primary font-medium">{trader.specialty}</p>
          </div>
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Following
              </>
            ) : (
              "Follow"
            )}
          </Button>
        </div>

        <p className="text-muted-foreground mt-3">{trader.bio}</p>

        {/* Badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {trader.badges.map((badge, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-5 gap-4 mt-6 p-4 bg-card border border-border rounded-2xl"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">{trader.stats.subscribers}</p>
            <p className="text-xs text-muted-foreground">Subscribers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-success mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">{trader.stats.winRate}%</p>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-success">{trader.stats.avgROI}</p>
            <p className="text-xs text-muted-foreground">Avg ROI</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-foreground mb-1">
              <Star className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">{trader.stats.totalTrades}</p>
            <p className="text-xs text-muted-foreground">Total Trades</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-sm text-foreground">{trader.stats.joinedDate}</p>
            <p className="text-xs text-muted-foreground">Joined</p>
          </div>
        </motion.div>

        {/* Subscription Card */}
        {!trader.isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 p-6 bg-gradient-card border border-primary/30 rounded-2xl glow-primary"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-4">
              Subscribe to {trader.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`p-4 rounded-xl border transition-all ${
                  selectedPlan === "monthly"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Monthly</p>
                <p className="font-display font-bold text-2xl text-foreground">{trader.pricing.monthly}</p>
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={`p-4 rounded-xl border transition-all relative ${
                  selectedPlan === "yearly"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-gold text-accent-foreground text-xs font-bold">
                  Save {trader.pricing.yearlyDiscount}
                </span>
                <p className="text-sm text-muted-foreground">Yearly</p>
                <p className="font-display font-bold text-2xl text-foreground">{trader.pricing.yearly}</p>
              </button>
            </div>

            <Button variant="hero" size="xl" className="w-full">
              <Zap className="w-5 h-5" />
              Subscribe Now
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Cancel anytime • Instant access to all content
            </p>
          </motion.div>
        )}

        {/* Discord Link */}
        <div className="mt-4 p-4 bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5865F2] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Join Discord</p>
              <p className="text-sm text-muted-foreground">Exclusive subscriber community</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Join
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TraderProfile;
