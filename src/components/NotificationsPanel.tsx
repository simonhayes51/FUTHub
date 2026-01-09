import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, TrendingUp, MessageCircle, UserPlus, Zap, AlertTriangle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "trade" | "comment" | "follow" | "alert" | "promo" | "result";
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  action?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Price Alert Triggered!",
    message: "Mbappé just hit your target price of 1.3M",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "trade",
    title: "FlipKingFC posted",
    message: "New Quick Flip alert - Time sensitive!",
    time: "5 min ago",
    read: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "3",
    type: "result",
    title: "Trade Result",
    message: "Your Haaland investment hit the target! +95K profit",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "comment",
    title: "SBCMaster replied",
    message: "Great timing on that flip! 🔥",
    time: "2 hours ago",
    read: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "5",
    type: "follow",
    title: "New Follower",
    message: "MetaTraderPro started following you",
    time: "3 hours ago",
    read: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "6",
    type: "promo",
    title: "Special Offer",
    message: "Get 50% off your first trader subscription!",
    time: "1 day ago",
    read: true,
  },
];

const NotificationsPanel = () => {
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const typeIcons = {
    trade: TrendingUp,
    comment: MessageCircle,
    follow: UserPlus,
    alert: AlertTriangle,
    promo: Gift,
    result: Zap,
  };

  const typeColors = {
    trade: "text-primary bg-primary/20",
    comment: "text-accent bg-accent/20",
    follow: "text-success bg-success/20",
    alert: "text-destructive bg-destructive/20",
    promo: "text-accent bg-accent/20",
    result: "text-success bg-success/20",
  };

  const markAsRead = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const filteredNotifs = filter === "unread" ? notifs.filter(n => !n.read) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary">
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {filteredNotifs.map((notif) => {
            const Icon = typeIcons[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 border-b border-border hover:bg-secondary/30 transition-colors group ${
                  !notif.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex gap-3">
                  {notif.avatar ? (
                    <img
                      src={notif.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColors[notif.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notif.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => markAsRead(notif.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotif(notif.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNotifs.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
