import { Home, Compass, Bell, User, PlusCircle } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

const MobileNav = ({ activeTab, onTabChange, notificationCount = 0 }: MobileNavProps) => {
  const navItems = [
    { id: "feed", icon: Home, label: "Feed" },
    { id: "discover", icon: Compass, label: "Discover" },
    { id: "create", icon: PlusCircle, label: "Post", isAction: true },
    { id: "notifications", icon: Bell, label: "Alerts", badge: notificationCount },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors relative ${
              item.isAction
                ? "bg-gradient-primary text-primary-foreground -mt-4 rounded-full w-14 h-14 flex items-center justify-center shadow-elevated glow-primary"
                : activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className={item.isAction ? "w-6 h-6" : "w-5 h-5"} />
            {!item.isAction && (
              <span className="text-xs">{item.label}</span>
            )}
            {item.badge && item.badge > 0 && (
              <span className="absolute -top-1 right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
