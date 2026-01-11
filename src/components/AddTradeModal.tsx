import { useState } from "react";
import { motion } from "framer-motion";
import { X, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTradeModal = ({ isOpen, onClose }: AddTradeModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    playerName: "",
    cardVersion: "Gold",
    rating: "",
    platform: "PS",
    buyPrice: "",
    sellPrice: "",
    quantity: "1",
    tag: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  // Search players
  const { data: searchResults } = useQuery({
    queryKey: ['player-search', searchQuery],
    queryFn: () => api.searchPlayers(searchQuery, formData.platform.toLowerCase()),
    enabled: searchQuery.length >= 3,
  });

  // Create trade mutation
  const createTradeMutation = useMutation({
    mutationFn: (data: any) => api.createTrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['trade-analytics'] });
      resetForm();
      onClose();
    },
    onError: () => {
      alert('Failed to create trade');
    },
  });

  const resetForm = () => {
    setFormData({
      playerName: "",
      cardVersion: "Gold",
      rating: "",
      platform: "PS",
      buyPrice: "",
      sellPrice: "",
      quantity: "1",
      tag: "",
      notes: "",
    });
    setSearchQuery("");
  };

  const handleSubmit = () => {
    if (!formData.playerName || !formData.buyPrice) {
      alert('Player name and buy price are required');
      return;
    }

    const tradeData = {
      ...formData,
      buyPrice: parseFloat(formData.buyPrice),
      sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : null,
      quantity: parseInt(formData.quantity),
      rating: formData.rating ? parseInt(formData.rating) : null,
    };

    createTradeMutation.mutate(tradeData);
  };

  const selectPlayer = (player: any) => {
    setFormData({
      ...formData,
      playerName: player.name,
      rating: player.rating?.toString() || "",
    });
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-elevated overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-foreground">Add Trade</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Player Search */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Search Player</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a player..."
                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated max-h-60 overflow-y-auto z-10">
                  {searchResults.map((player: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => selectPlayer(player)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{player.name}</p>
                        <p className="text-xs text-muted-foreground">Rating: {player.rating}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Or Manual Entry */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground mb-2 block">Player Name *</label>
              <input
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                placeholder="e.g., Kylian Mbappé"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Card Version</label>
              <select
                value={formData.cardVersion}
                onChange={(e) => setFormData({ ...formData, cardVersion: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="Gold">Gold</option>
                <option value="TOTW">TOTW</option>
                <option value="Icon">Icon</option>
                <option value="Hero">Hero</option>
                <option value="TOTY">TOTY</option>
                <option value="Special">Special</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Rating</label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                placeholder="e.g., 91"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="PS">PlayStation</option>
                <option value="XBOX">Xbox</option>
                <option value="PC">PC</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="1"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Buy Price *</label>
              <input
                type="number"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                placeholder="e.g., 285000"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Sell Price (Optional)</label>
              <input
                type="number"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                placeholder="Leave empty if active"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">No Tag</option>
                <option value="Snipe">Snipe</option>
                <option value="Investment">Investment</option>
                <option value="Flip">Flip</option>
                <option value="SBC">SBC</option>
                <option value="Pack Pull">Pack Pull</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-sm text-muted-foreground mb-2 block">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes about this trade..."
                rows={3}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-secondary/30 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formData.sellPrice && formData.buyPrice && (
              <>
                Estimated profit: <span className="text-success font-medium">
                  {(parseFloat(formData.sellPrice) - parseFloat(formData.buyPrice) - (parseFloat(formData.sellPrice) * 0.05)).toFixed(0)}
                </span> (after 5% EA tax)
              </>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button
              variant="hero"
              onClick={handleSubmit}
              disabled={!formData.playerName || !formData.buyPrice || createTradeMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              {createTradeMutation.isPending ? 'Adding...' : 'Add Trade'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddTradeModal;
