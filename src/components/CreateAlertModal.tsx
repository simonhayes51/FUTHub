import { useState } from "react";
import { useMutation, useQueryClient } from "@tantml:react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistId: string;
}

const CreateAlertModal = ({
  isOpen,
  onClose,
  watchlistId,
}: CreateAlertModalProps) => {
  const [formData, setFormData] = useState({
    playerName: "",
    alertType: "PRICE_DROP",
    targetPrice: "",
    priceDropPercent: "",
    priceRisePercent: "",
    discordNotify: false,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createAlertMutation = useMutation({
    mutationFn: (data: any) => api.createWatchlistAlert(watchlistId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', watchlistId] });
      toast({
        title: "Alert created",
        description: "You'll be notified when conditions are met.",
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create alert",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      playerName: "",
      alertType: "PRICE_DROP",
      targetPrice: "",
      priceDropPercent: "",
      priceRisePercent: "",
      discordNotify: false,
    });
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

    // Validate based on alert type
    if (formData.alertType === "PRICE_DROP" || formData.alertType === "PRICE_RISE") {
      if (!formData.targetPrice) {
        toast({
          title: "Error",
          description: "Please enter a target price",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.alertType === "PERCENTAGE_DROP" && !formData.priceDropPercent) {
      toast({
        title: "Error",
        description: "Please enter a price drop percentage",
        variant: "destructive",
      });
      return;
    }

    if (formData.alertType === "PERCENTAGE_RISE" && !formData.priceRisePercent) {
      toast({
        title: "Error",
        description: "Please enter a price rise percentage",
        variant: "destructive",
      });
      return;
    }

    createAlertMutation.mutate({
      playerName: formData.playerName,
      alertType: formData.alertType,
      targetPrice: formData.targetPrice || null,
      priceDropPercent: formData.priceDropPercent || null,
      priceRisePercent: formData.priceRisePercent || null,
      discordNotify: formData.discordNotify,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Create Price Alert
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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
            <Label htmlFor="alertType">Alert Type</Label>
            <Select
              value={formData.alertType}
              onValueChange={(value) =>
                setFormData({ ...formData, alertType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRICE_DROP">Price drops below</SelectItem>
                <SelectItem value="PRICE_RISE">Price rises above</SelectItem>
                <SelectItem value="PERCENTAGE_DROP">Percentage drop</SelectItem>
                <SelectItem value="PERCENTAGE_RISE">Percentage rise</SelectItem>
                <SelectItem value="VOLUME_SPIKE">Volume spike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.alertType === "PRICE_DROP" ||
            formData.alertType === "PRICE_RISE") && (
            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price *</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="e.g., 50000"
                value={formData.targetPrice}
                onChange={(e) =>
                  setFormData({ ...formData, targetPrice: e.target.value })
                }
                required
              />
            </div>
          )}

          {formData.alertType === "PERCENTAGE_DROP" && (
            <div className="space-y-2">
              <Label htmlFor="priceDropPercent">Drop Percentage *</Label>
              <Input
                id="priceDropPercent"
                type="number"
                placeholder="e.g., 10"
                value={formData.priceDropPercent}
                onChange={(e) =>
                  setFormData({ ...formData, priceDropPercent: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Alert when price drops by this percentage
              </p>
            </div>
          )}

          {formData.alertType === "PERCENTAGE_RISE" && (
            <div className="space-y-2">
              <Label htmlFor="priceRisePercent">Rise Percentage *</Label>
              <Input
                id="priceRisePercent"
                type="number"
                placeholder="e.g., 15"
                value={formData.priceRisePercent}
                onChange={(e) =>
                  setFormData({ ...formData, priceRisePercent: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Alert when price rises by this percentage
              </p>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Label htmlFor="discord">Discord Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Send alerts to your Discord
              </p>
            </div>
            <Switch
              id="discord"
              checked={formData.discordNotify}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, discordNotify: checked })
              }
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={createAlertMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createAlertMutation.isPending}>
              {createAlertMutation.isPending ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlertModal;
