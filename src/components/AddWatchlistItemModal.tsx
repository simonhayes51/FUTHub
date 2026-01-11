import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface AddWatchlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistId: string;
  platform: string;
}

const AddWatchlistItemModal = ({
  isOpen,
  onClose,
  watchlistId,
  platform,
}: AddWatchlistItemModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    playerName: "",
    cardId: "",
    rating: "",
    targetPrice: "",
    buyPrice: "",
    notes: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Search players from FUT.GG
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['player-search', searchQuery, platform],
    queryFn: () => api.searchPlayers(searchQuery, platform.toLowerCase()),
    enabled: searchQuery.length >= 3,
  });

  const addItemMutation = useMutation({
    mutationFn: (data: any) => api.addWatchlistItem(watchlistId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', watchlistId] });
      toast({
        title: "Player added",
        description: "Player has been added to your watchlist.",
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add player",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSearchQuery("");
    setFormData({
      playerName: "",
      cardId: "",
      rating: "",
      targetPrice: "",
      buyPrice: "",
      notes: "",
    });
  };

  const handleSelectPlayer = (player: any) => {
    setFormData({
      ...formData,
      playerName: player.name || player.playerName,
      cardId: player.id?.toString() || player.cardId?.toString() || "",
      rating: player.rating?.toString() || "",
    });
    setSearchQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.playerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    addItemMutation.mutate({
      playerName: formData.playerName,
      cardId: formData.cardId || null,
      rating: formData.rating || null,
      targetPrice: formData.targetPrice || null,
      buyPrice: formData.buyPrice || null,
      notes: formData.notes || null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Player to Watchlist</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Players</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Search Results */}
            {searchQuery.length >= 3 && (
              <div className="border border-border rounded-lg p-2 max-h-48 overflow-y-auto bg-card">
                {searchLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((player: any, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectPlayer(player)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {player.name || player.playerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {player.version || player.cardVersion || "Standard"}
                          </p>
                        </div>
                        {player.rating && (
                          <Badge variant="secondary">{player.rating}</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No players found
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="playerName">Player Name *</Label>
              <Input
                id="playerName"
                placeholder="e.g., Cristiano Ronaldo"
                value={formData.playerName}
                onChange={(e) =>
                  setFormData({ ...formData, playerName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                placeholder="e.g., 91"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardId">Card ID</Label>
              <Input
                id="cardId"
                placeholder="Optional"
                value={formData.cardId}
                onChange={(e) =>
                  setFormData({ ...formData, cardId: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="e.g., 50000"
                value={formData.targetPrice}
                onChange={(e) =>
                  setFormData({ ...formData, targetPrice: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price (Optional)</Label>
              <Input
                id="buyPrice"
                type="number"
                placeholder="If already bought"
                value={formData.buyPrice}
                onChange={(e) =>
                  setFormData({ ...formData, buyPrice: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={addItemMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addItemMutation.isPending}>
              {addItemMutation.isPending ? "Adding..." : "Add to Watchlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWatchlistItemModal;
