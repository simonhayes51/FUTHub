import { Home, Compass, Bell, Bookmark, Settings, TrendingUp, Search, Calculator, Users, LogOut, MessageCircle, LineChart, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoIcon from "@/assets/transfer-traders-icon.svg";

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "feed", label: "Feed", icon: Home },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  { id: "saved", label: "Saved", icon: Bookmark },
];

const toolItems = [
  { id: "trades", label: "My Trades", icon: LineChart },
  { id: "watchlist", label: "Watchlists", icon: Eye },
  { id: "prices", label: "Price Checker", icon: Search },
  { id: "trends", label: "Market Trends", icon: TrendingUp },
  { id: "sbc", label: "SBC Solver", icon: Calculator },
  { id: "squad", label: "Squad Builder", icon: Users },
];

const SidebarNav = ({ activeTab, onTabChange }: SidebarNavProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const displayName = user?.username || "Guest";
  const displayHandle = user?.username ? `@${user.username}` : "Sign in to personalize";
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 mb-2">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="Transfer Traders" className="h-10 w-10" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xs text-gradient-primary">TRANSFER</span>
            <span className="font-display text-xs text-gradient-purple">TRADERS</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Tools Section */}
      <div className="px-2 mt-6">
        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Tools
        </p>
        <div className="space-y-1">
          {toolItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto px-2 pb-4 space-y-1">
        <button
          onClick={() => onTabChange("profile")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-destructive transition-all"
          disabled={!isAuthenticated}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log Out</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face"}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayHandle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
