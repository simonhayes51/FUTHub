import { useEffect, useState } from "react";
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
import { Filter, Sparkles, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeed } from "@/hooks/useFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";

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

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeTrader, setActiveTrader] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchParams] = useSearchParams();

  // Fetch real feed data from API
  const { data: posts = [], isLoading, error } = useFeed({ limit: 20 });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const allowedTabs = new Set([
      "feed",
      "discover",
      "notifications",
      "prices",
      "profile",
      "trader-profile",
    ]);

    if (tabParam && allowedTabs.has(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const filteredPosts = activeTrader
    ? posts.filter((post: any) => post.traderId === activeTrader)
    : posts;

  const renderPlaceholder = (title: string, description: string) => (
    <div className="p-8 rounded-xl border border-border bg-card text-center">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );

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
      case "saved":
        return renderPlaceholder(
          "Saved Posts",
          "Save tips and market calls to review them later. This feature is coming soon."
        );
      case "trends":
        return renderPlaceholder(
          "Market Trends",
          "Live market trend dashboards are on the way. Check back soon."
        );
      case "sbc":
        return renderPlaceholder(
          "SBC Solver",
          "We are polishing the SBC solver experience. Launching soon."
        );
      case "squad":
        return renderPlaceholder(
          "Squad Builder",
          "Build and compare squads with community insights soon."
        );
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
              {isLoading ? (
                // Loading skeletons
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ))}
                </>
              ) : error ? (
                // Error state
                <div className="p-8 rounded-xl border border-destructive/50 bg-destructive/10 text-center">
                  <p className="text-destructive font-medium">Failed to load feed</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {error instanceof Error ? error.message : 'Something went wrong'}
                  </p>
                </div>
              ) : filteredPosts.length === 0 ? (
                // Empty state
                <div className="p-8 rounded-xl border border-border bg-card text-center">
                  <p className="text-muted-foreground">No posts to show</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Subscribe to traders to see their content here
                  </p>
                </div>
              ) : (
                // Posts
                filteredPosts.map((post: any) => (
                  <PostCard key={post.id} {...post} />
                ))
              )}
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
