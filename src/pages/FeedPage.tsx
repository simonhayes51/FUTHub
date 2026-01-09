import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SidebarNav from "@/components/SidebarNav";
import SubscribedTraders from "@/components/SubscribedTraders";
import PostCard from "@/components/PostCard";
import RightSidebar from "@/components/RightSidebar";
import StoriesBar from "@/components/StoriesBar";
import PortfolioWidget from "@/components/PortfolioWidget";
import AchievementsWidget from "@/components/AchievementsWidget";
import NotificationsPanel from "@/components/NotificationsPanel";
import PriceChecker from "@/components/PriceChecker";
import TraderProfile from "@/components/TraderProfile";
import DiscoverPage from "@/components/DiscoverPage";
import UserDashboard from "@/components/UserDashboard";
import MobileNav from "@/components/MobileNav";
import CreatePostModal from "@/components/CreatePostModal";
import { Filter, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const subscribedTraders = [
  {
    id: "1",
    name: "FlipKingFC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    verified: true,
    isLive: true,
    specialty: "Quick Flips",
  },
  {
    id: "2",
    name: "SBCMaster",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    verified: true,
    isLive: false,
    specialty: "SBC Investments",
  },
  {
    id: "3",
    name: "MetaTraderPro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    verified: true,
    isLive: false,
    specialty: "Meta Predictions",
  },
  {
    id: "4",
    name: "IconInvestor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    verified: true,
    isLive: false,
    specialty: "Icon Trading",
  },
];

const posts = [
  {
    id: "1",
    trader: {
      name: "FlipKingFC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      verified: true,
    },
    type: "flip" as const,
    timeAgo: "5 min ago",
    content: "🚨 QUICK FLIP ALERT! Mbappé is about to spike due to upcoming SBC requirements. Get in NOW before it's too late. This is a time-sensitive opportunity!",
    card: {
      name: "Kylian Mbappé",
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=200&h=300&fit=crop",
      buyPrice: "1.1M - 1.15M",
      sellPrice: "1.35M+",
      platform: "All Platforms",
      risk: "medium" as const,
      roi: "+18%",
      isProfit: true,
    },
    likes: 234,
    comments: 45,
  },
  {
    id: "2",
    trader: {
      name: "SBCMaster",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      verified: true,
    },
    type: "sbc" as const,
    timeAgo: "32 min ago",
    content: "The new Icon SBC is coming this Friday. Stock up on these 86-rated fodder cards NOW. They're at their lowest price point of the week. Easy 30-40% profit when the SBC drops.",
    card: {
      name: "86 Rated Fodder",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=300&fit=crop",
      buyPrice: "18K - 20K",
      sellPrice: "28K+",
      platform: "PS & Xbox",
      risk: "low" as const,
      roi: "+42%",
      isProfit: true,
    },
    likes: 567,
    comments: 89,
  },
  {
    id: "3",
    trader: {
      name: "MetaTraderPro",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      verified: true,
    },
    type: "prediction" as const,
    timeAgo: "1 hour ago",
    content: "📊 MARKET ANALYSIS: The TOTY promo is 3 weeks away. Based on historical data, we're about to see a major market crash. I'm liquidating 70% of my club value today. Here's my full breakdown...",
    likes: 892,
    comments: 156,
    isPremium: true,
  },
  {
    id: "4",
    trader: {
      name: "IconInvestor",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
      verified: true,
    },
    type: "trade" as const,
    timeAgo: "2 hours ago",
    content: "Baby Gullit just hit his lowest price in 2 weeks. This is a solid long-term hold. He's an elite card that always rebounds. Perfect time to invest if you have the coins.",
    card: {
      name: "Ruud Gullit (Baby)",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=200&h=300&fit=crop",
      buyPrice: "2.8M - 2.9M",
      sellPrice: "3.4M+",
      platform: "All Platforms",
      risk: "low" as const,
      roi: "+20%",
      isProfit: true,
    },
    likes: 423,
    comments: 67,
  },
];

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeTrader, setActiveTrader] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPosts = activeTrader
    ? posts.filter((post) => 
        subscribedTraders.find(t => t.id === activeTrader)?.name === post.trader.name
      )
    : posts;

  const renderMainContent = () => {
    switch (activeTab) {
      case "discover":
        return <DiscoverPage />;
      case "notifications":
        return <NotificationsPanel />;
      case "prices":
        return <PriceChecker />;
      case "profile":
        return <UserDashboard />;
      case "trader-profile":
        return <TraderProfile />;
      default:
        return (
          <>
            {/* Stories */}
            <StoriesBar />

            {/* Achievements */}
            <AchievementsWidget />

            {/* Feed Header */}
            <div className="flex items-center justify-between my-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Your Feed</h1>
                <p className="text-sm text-muted-foreground">Latest tips from your traders</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={feedFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFeedFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={feedFilter === "trades" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFeedFilter("trades")}
                >
                  Trades
                </Button>
                <Button
                  variant={feedFilter === "predictions" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFeedFilter("predictions")}
                >
                  Predictions
                </Button>
                <Button variant="ghost" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* New Posts Indicator */}
            <button className="w-full mb-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
              <Sparkles className="w-4 h-4" />
              3 new posts available
            </button>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <div className="flex">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card">
          <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex gap-6">
              {/* Feed Column */}
              <div className="flex-1 max-w-2xl">
                {renderMainContent()}
              </div>

              {/* Right Column - Only show on feed */}
              {activeTab === "feed" && (
                <div className="hidden xl:block w-80 space-y-4">
                  {/* Portfolio Widget */}
                  <PortfolioWidget />

                  {/* Subscribed Traders */}
                  <SubscribedTraders
                    traders={subscribedTraders}
                    activeTrader={activeTrader}
                    onTraderSelect={setActiveTrader}
                  />

                  {/* Right Sidebar Content */}
                  <RightSidebar />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          if (tab === "create") {
            setShowCreateModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        notificationCount={3}
      />

      {/* Floating Action Button - Desktop */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="hidden lg:flex fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-primary items-center justify-center text-primary-foreground shadow-elevated glow-primary hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePostModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedPage;
