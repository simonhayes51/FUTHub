import { Heart, MessageCircle, Bookmark, Share2, TrendingUp, TrendingDown, Clock, Shield, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PostCardProps {
  trader: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  type: "trade" | "prediction" | "sbc" | "flip";
  timeAgo: string;
  content: string;
  card?: {
    name: string;
    image: string;
    buyPrice: string;
    sellPrice: string;
    platform: string;
    risk: "low" | "medium" | "high";
    roi: string;
    isProfit: boolean;
  };
  likes: number;
  comments: number;
  isPremium?: boolean;
}

const PostCard = ({
  trader,
  type,
  timeAgo,
  content,
  card,
  likes,
  comments,
  isPremium = false,
}: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const typeStyles = {
    trade: { bg: "bg-primary/20", text: "text-primary", label: "Trade Tip" },
    prediction: { bg: "bg-accent/20", text: "text-accent", label: "Prediction" },
    sbc: { bg: "bg-success/20", text: "text-success", label: "SBC Investment" },
    flip: { bg: "bg-destructive/20", text: "text-destructive", label: "Quick Flip" },
  };

  const riskColors = {
    low: "text-success",
    medium: "text-accent",
    high: "text-destructive",
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-border/80 transition-colors">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={trader.avatar}
              alt={trader.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-border"
            />
            {trader.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center">
                <Shield className="w-3 h-3 text-accent-foreground" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{trader.name}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeStyles[type].bg} ${typeStyles[type].text} font-medium`}>
                {typeStyles[type].label}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-foreground mb-4">{content}</p>

        {/* Card Details */}
        {card && (
          <div className="bg-secondary/50 rounded-xl p-4 border border-border">
            <div className="flex items-start gap-4">
              <img
                src={card.image}
                alt={card.name}
                className="w-20 h-28 rounded-lg object-cover border border-border"
              />
              <div className="flex-1">
                <h5 className="font-display font-bold text-lg text-foreground mb-2">{card.name}</h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Buy Range</span>
                    <span className="text-foreground font-semibold">{card.buyPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Sell Target</span>
                    <span className="text-success font-semibold">{card.sellPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Platform</span>
                    <span className="text-foreground font-medium">{card.platform}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Risk</span>
                    <span className={`font-semibold capitalize ${riskColors[card.risk]}`}>{card.risk}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Expected ROI</span>
                  <span className={`font-display font-bold text-lg flex items-center gap-1 ${card.isProfit ? "text-success" : "text-destructive"}`}>
                    {card.isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {card.roi}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Blur Overlay */}
        {isPremium && (
          <div className="relative mt-4 rounded-xl overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-md bg-background/60 flex flex-col items-center justify-center z-10">
              <Shield className="w-8 h-8 text-accent mb-2" />
              <p className="text-foreground font-semibold">Premium Content</p>
              <Button variant="gold" size="sm" className="mt-2">
                Subscribe to View
              </Button>
            </div>
            <div className="h-32 bg-secondary/50" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${liked ? "text-destructive" : "text-muted-foreground"}`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
            {comments}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={bookmarked ? "text-primary" : "text-muted-foreground"}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
