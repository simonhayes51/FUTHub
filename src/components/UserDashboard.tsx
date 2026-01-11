import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  TrendingUp,
  Wallet,
  Star,
  Calendar,
  Edit,
  ExternalLink,
  Trophy,
  Zap,
  Users,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import BecomeTraderModal from "@/components/BecomeTraderModal";
import DiscordIntegration from "@/components/DiscordIntegration";

const UserDashboard = () => {
  const { user: authUser } = useAuth();
  const [showTraderModal, setShowTraderModal] = useState(false);

  // Format join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const user = {
    name: authUser?.username || "Guest User",
    username: `@${authUser?.username?.toLowerCase() || "guest"}`,
    avatar: authUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    joinDate: authUser?.createdAt ? formatJoinDate(authUser.createdAt) : "Recently",
    level: authUser?.level || 1,
    xp: authUser?.xp || 0,
    xpToNext: ((authUser?.level || 1) + 1) * 1000,
    rank: 847, // TODO: Calculate from backend
    stats: {
      totalProfit: "+2.4M", // TODO: Get from portfolio/trades API
      winRate: 78, // TODO: Calculate from trades
      tradesExecuted: 156, // TODO: Get from trades API
      subscriptions: 4, // TODO: Get from subscriptions API
    },
  };

  const subscriptions = [
    { name: "FlipKingFC", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", price: "£14.99", renews: "Jan 15" },
    { name: "SBCMaster", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", price: "£9.99", renews: "Jan 20" },
    { name: "MetaTraderPro", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", price: "£19.99", renews: "Jan 22" },
  ];

  const menuItems = [
    { icon: User, label: "Edit Profile", href: "#" },
    { icon: CreditCard, label: "Billing & Payments", href: "#" },
    { icon: Bell, label: "Notification Settings", href: "#" },
    { icon: Shield, label: "Privacy & Security", href: "#" },
    { icon: ExternalLink, label: "Connected Accounts", href: "#" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-border"
            />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Edit className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Level {user.level}
              </span>
            </div>
            <p className="text-muted-foreground">{user.username}</p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Member since {user.joinDate}
            </p>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">XP Progress</span>
                <span className="text-foreground font-medium">{user.xp.toLocaleString()} / {user.xpToNext.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-primary"
                />
              </div>
            </div>
          </div>

          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-success mb-1">
              <Wallet className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-success">{user.stats.totalProfit}</p>
            <p className="text-xs text-muted-foreground">Total Profit</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">{user.stats.winRate}%</p>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Star className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">{user.stats.tradesExecuted}</p>
            <p className="text-xs text-muted-foreground">Trades</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-foreground mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="font-display font-bold text-xl text-foreground">#{user.rank}</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </div>
        </div>
      </motion.div>

      {/* Active Subscriptions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Active Subscriptions</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            Manage
          </Button>
        </div>

        <div className="divide-y divide-border">
          {subscriptions.map((sub, index) => (
            <div key={index} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
              <img
                src={sub.avatar}
                alt={sub.name}
                className="w-12 h-12 rounded-xl object-cover border border-border"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{sub.name}</p>
                <p className="text-sm text-muted-foreground">Renews {sub.renews}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{sub.price}</p>
                <p className="text-xs text-muted-foreground">/month</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Account Settings
          </h2>
        </div>

        <div className="divide-y divide-border">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Discord Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Discord Connection
          </h2>
        </div>
        <div className="p-6">
          <DiscordIntegration />
        </div>
      </motion.div>

      {/* Become a Trader CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-card border border-accent/30 rounded-2xl p-6 glow-gold"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
            <Star className="w-7 h-7 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-foreground">Become a Trader</h3>
            <p className="text-sm text-muted-foreground">
              Share your tips and earn money from subscribers
            </p>
          </div>
          <Button variant="gold" onClick={() => setShowTraderModal(true)}>Apply Now</Button>
        </div>
      </motion.div>

      {/* Become Trader Modal */}
      <BecomeTraderModal isOpen={showTraderModal} onClose={() => setShowTraderModal(false)} />
    </div>
  );
};

export default UserDashboard;
