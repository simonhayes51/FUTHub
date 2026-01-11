import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, RefreshCw, Bell, Trash2, Edit, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import CreateWatchlistModal from "@/components/CreateWatchlistModal";
import AddWatchlistItemModal from "@/components/AddWatchlistItemModal";
import CreateAlertModal from "@/components/CreateAlertModal";
import { useToast } from "@/hooks/use-toast";

const WatchlistPage = () => {
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all watchlists
  const { data: watchlists = [], isLoading: watchlistsLoading } = useQuery({
    queryKey: ['watchlists'],
    queryFn: () => api.getWatchlists(),
  });

  // Fetch usage stats
  const { data: usageStats } = useQuery({
    queryKey: ['watchlist-usage'],
    queryFn: () => api.getWatchlistUsageStats(),
  });

  // Fetch selected watchlist details
  const { data: watchlistDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['watchlist', selectedWatchlist],
    queryFn: () => api.getWatchlist(selectedWatchlist!),
    enabled: !!selectedWatchlist,
  });

  // Delete watchlist mutation
  const deleteWatchlistMutation = useMutation({
    mutationFn: (id: string) => api.deleteWatchlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      queryClient.invalidateQueries({ queryKey: ['watchlist-usage'] });
      setSelectedWatchlist(null);
      toast({
        title: "Watchlist deleted",
        description: "Your watchlist has been removed successfully.",
      });
    },
  });

  // Refresh watchlist prices mutation
  const refreshPricesMutation = useMutation({
    mutationFn: (id: string) => api.refreshWatchlistPrices(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', selectedWatchlist] });
      toast({
        title: "Prices refreshed",
        description: "Watchlist prices have been updated.",
      });
    },
  });

  // Delete watchlist item mutation
  const deleteItemMutation = useMutation({
    mutationFn: ({ watchlistId, itemId }: { watchlistId: string; itemId: string }) =>
      api.deleteWatchlistItem(watchlistId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', selectedWatchlist] });
      toast({
        title: "Item removed",
        description: "Player removed from watchlist.",
      });
    },
  });

  // Delete alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: ({ watchlistId, alertId }: { watchlistId: string; alertId: string }) =>
      api.deleteWatchlistAlert(watchlistId, alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', selectedWatchlist] });
      toast({
        title: "Alert deleted",
        description: "Price alert has been removed.",
      });
    },
  });

  const selectedWatchlistData = watchlists.find((w: any) => w.id === selectedWatchlist);

  // Calculate tier name for display
  const getTierName = () => {
    if (!usageStats) return "Basic";
    if (usageStats.limit === 500) return "Elite";
    if (usageStats.limit === 25) return "Pro";
    return "Basic";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Watchlists</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track player prices and set alerts
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          disabled={usageStats && usageStats.used >= usageStats.limit}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Watchlist
        </Button>
      </div>

      {/* Usage Stats */}
      {usageStats && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Watchlist Usage</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {usageStats.used} / {usageStats.limit}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs">
                  {getTierName()} Tier
                </Badge>
                {usageStats.used >= usageStats.limit && (
                  <p className="text-xs text-destructive mt-2">
                    Upgrade to create more watchlists
                  </p>
                )}
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${Math.min(usageStats.percentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlists List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-lg text-foreground">Your Watchlists</h2>

          {watchlistsLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </>
          ) : watchlists.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No watchlists yet. Create one to start tracking player prices.
                </p>
              </CardContent>
            </Card>
          ) : (
            watchlists.map((watchlist: any) => (
              <Card
                key={watchlist.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedWatchlist === watchlist.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedWatchlist(watchlist.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{watchlist.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {watchlist.platform} • {watchlist._count?.items || 0} items
                      </CardDescription>
                    </div>
                    {watchlist._count?.alerts > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <Bell className="w-3 h-3" />
                        {watchlist._count.alerts}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Watchlist Details */}
        <div className="lg:col-span-2">
          {!selectedWatchlist ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a watchlist to view details
                </p>
              </CardContent>
            </Card>
          ) : detailsLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Watchlist Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedWatchlistData?.name}</CardTitle>
                      <CardDescription>
                        {selectedWatchlistData?.platform} Platform
                        {watchlistDetails?.lastRefreshed && (
                          <> • Last updated {new Date(watchlistDetails.lastRefreshed).toLocaleString()}</>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshPricesMutation.mutate(selectedWatchlist)}
                        disabled={refreshPricesMutation.isPending}
                      >
                        <RefreshCw className={`w-4 h-4 ${refreshPricesMutation.isPending ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddItemModal(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAlertModal(true)}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this watchlist?")) {
                            deleteWatchlistMutation.mutate(selectedWatchlist);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Watchlist Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Players ({watchlistDetails?.items?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {watchlistDetails?.items?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No players in this watchlist yet.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setShowAddItemModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Player
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {watchlistDetails?.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{item.playerName}</p>
                              {item.rating && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.rating}
                                </Badge>
                              )}
                            </div>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-6">
                            {item.currentPrice && (
                              <div className="text-right">
                                <p className="text-sm font-medium text-foreground">
                                  {item.currentPrice.toLocaleString()} coins
                                </p>
                                {item.priceChange !== null && item.priceChange !== undefined && (
                                  <div className="flex items-center gap-1 text-xs">
                                    {item.priceChange > 0 ? (
                                      <>
                                        <TrendingUp className="w-3 h-3 text-success" />
                                        <span className="text-success">+{item.priceChange}%</span>
                                      </>
                                    ) : item.priceChange < 0 ? (
                                      <>
                                        <TrendingDown className="w-3 h-3 text-destructive" />
                                        <span className="text-destructive">{item.priceChange}%</span>
                                      </>
                                    ) : (
                                      <>
                                        <Minus className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">0%</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {item.targetPrice && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Target</p>
                                <p className="text-sm font-medium text-foreground">
                                  {item.targetPrice.toLocaleString()}
                                </p>
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Remove this player?")) {
                                  deleteItemMutation.mutate({
                                    watchlistId: selectedWatchlist,
                                    itemId: item.id,
                                  });
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Alerts */}
              {watchlistDetails?.alerts && watchlistDetails.alerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Active Alerts ({watchlistDetails.alerts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {watchlistDetails.alerts.map((alert: any) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50"
                        >
                          <div>
                            <p className="font-medium text-foreground">{alert.playerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.alertType === "PRICE_DROP" && `Alert when price drops below ${alert.targetPrice}`}
                              {alert.alertType === "PRICE_RISE" && `Alert when price rises above ${alert.targetPrice}`}
                              {alert.alertType === "PERCENTAGE_DROP" && `Alert on ${alert.priceDropPercent}% drop`}
                              {alert.alertType === "PERCENTAGE_RISE" && `Alert on ${alert.priceRisePercent}% rise`}
                              {alert.discordNotify && " • Discord notification enabled"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Delete this alert?")) {
                                deleteAlertMutation.mutate({
                                  watchlistId: selectedWatchlist,
                                  alertId: alert.id,
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateWatchlistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedWatchlist && (
        <>
          <AddWatchlistItemModal
            isOpen={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            watchlistId={selectedWatchlist}
            platform={selectedWatchlistData?.platform || "PS"}
          />

          <CreateAlertModal
            isOpen={showAlertModal}
            onClose={() => setShowAlertModal(false)}
            watchlistId={selectedWatchlist}
          />
        </>
      )}
    </div>
  );
};

export default WatchlistPage;
