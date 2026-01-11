import { Home, Compass, Bell, Bookmark, Settings, TrendingUp, Search, Calculator, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "feed", label: "Feed", icon: Home },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  { id: "saved", label: "Saved", icon: Bookmark },
];

const toolItems = [
  { id: "prices", label: "Price Checker", icon: Search },
  { id: "trends", label: "Market Trends", icon: TrendingUp },
  { id: "sbc", label: "SBC Solver", icon: Calculator },
  { id: "squad", label: "Squad Builder", icon: Users },
];

const SidebarNav = ({ activeTab, onTabChange }: SidebarNavProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider">
            FC<span className="text-primary">HUB</span>
          </span>
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
          onClick={() => alert("Settings coming soon!")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-destructive transition-all"
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
            alt="Your profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-border"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{user?.username || "Guest"}</p>
            <p className="text-xs text-muted-foreground">@{user?.username?.toLowerCase() || "guest"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
