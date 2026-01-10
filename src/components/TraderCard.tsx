import { TrendingUp, Star, Shield, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscribe } from "@/hooks/useTraders";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface TraderCardProps {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  winRate: number;
  avgROI: number | string;
  subscribers: string;
  verified: boolean;
  price: string;
  featured?: boolean;
}

const TraderCard = ({
  id,
  name,
  avatar,
  specialty,
  winRate,
  avgROI,
  subscribers,
  verified,
  price,
  featured = false,
}: TraderCardProps) => {
  const { isAuthenticated } = useAuth();
  const subscribeMutation = useSubscribe();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const formatPercent = (value: number | string) => {
    if (typeof value === "string") {
      return value.includes("%") ? value : `${value}%`;
    }
    return `${value}%`;
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    subscribeMutation.mutate({ traderId: id, tier: 'MONTHLY' });
  };
  return (
    <div
      className={`relative rounded-2xl bg-gradient-card border overflow-hidden card-hover ${
        featured ? "border-primary/50 glow-primary" : "border-border"
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-border"
              />
              {verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Shield className="w-3 h-3 text-accent-foreground" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {name}
                {featured && <Star className="w-4 h-4 text-accent fill-accent" />}
              </h3>
              <p className="text-sm text-muted-foreground">{specialty}</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-semibold">
            {winRate}% Win
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-1 text-success mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold">{formatPercent(avgROI)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Avg ROI</span>
          </div>
          <div className="p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-1 text-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="font-bold">{subscribers}</span>
            </div>
            <span className="text-xs text-muted-foreground">Subscribers</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-display font-bold text-foreground">{price}</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <Button
            variant={featured ? "hero" : "outline"}
            size="sm"
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TraderCard;
