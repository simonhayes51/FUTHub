import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface EditTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
}

const EditTradeModal = ({ isOpen, onClose, trade }: EditTradeModalProps) => {
  const [formData, setFormData] = useState({
    playerName: "",
    cardVersion: "",
    rating: "",
    platform: "",
    buyPrice: "",
    sellPrice: "",
    quantity: "",
    tag: "",
    notes: "",
    status: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (trade) {
      setFormData({
        playerName: trade.playerName || "",
        cardVersion: trade.cardVersion || "Gold",
        rating: trade.rating?.toString() || "",
        platform: trade.platform || "PS",
        buyPrice: trade.buyPrice?.toString() || "",
        sellPrice: trade.sellPrice?.toString() || "",
        quantity: trade.quantity?.toString() || "1",
        tag: trade.tag || "",
        notes: trade.notes || "",
        status: trade.status || "ACTIVE",
      });
    }
  }, [trade]);

  const updateTradeMutation = useMutation({
    mutationFn: (data: any) => api.updateTrade(trade.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['trade-analytics'] });
      onClose();
    },
    onError: () => {
      alert('Failed to update trade');
    },
  });

  const handleSubmit = () => {
    const updateData = {
      ...formData,
      buyPrice: parseFloat(formData.buyPrice),
      sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : null,
      quantity: parseInt(formData.quantity),
      rating: formData.rating ? parseInt(formData.rating) : null,
    };

    updateTradeMutation.mutate(updateData);
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
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-elevated overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border bg-gradient-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-foreground">Edit Trade</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground mb-2 block">Player Name</label>
              <input
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Buy Price</label>
              <input
                type="number"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Sell Price</label>
              <input
                type="number"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
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

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-sm text-muted-foreground mb-2 block">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="hero"
            onClick={handleSubmit}
            disabled={updateTradeMutation.isPending}
          >
            <Save className="w-4 h-4 mr-1" />
            {updateTradeMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditTradeModal;
