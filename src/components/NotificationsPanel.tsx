import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, TrendingUp, MessageCircle, UserPlus, Zap, AlertTriangle, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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

const NotificationsPanel = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch notifications from API
  const { data: notifs = [], isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getNotifications(),
    staleTime: 1000 * 60, // 1 minute
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({ title: 'Notification deleted' });
    },
  });

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
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    // Mark all unread notifications as read
    const unreadIds = notifs.filter((n: any) => !n.read).map((n: any) => n.id);
    unreadIds.forEach(id => markAsReadMutation.mutate(id));
  };

  const deleteNotif = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredNotifs = filter === "unread" ? notifs.filter((n: any) => !n.read) : notifs;
  const unreadCount = notifs.filter((n: any) => !n.read).length;

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-destructive/50 rounded-2xl p-8 text-center">
        <p className="text-destructive font-medium">Failed to load notifications</p>
      </div>
    );
  }

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
