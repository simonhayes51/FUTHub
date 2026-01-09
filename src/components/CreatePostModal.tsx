import { useState } from "react";
import { motion } from "framer-motion";
import { X, Image, TrendingUp, Zap, Calendar, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const postTypes = [
  { id: "trade", label: "Trade Tip", icon: TrendingUp, color: "text-primary bg-primary/20" },
  { id: "flip", label: "Quick Flip", icon: Zap, color: "text-destructive bg-destructive/20" },
  { id: "sbc", label: "SBC Investment", icon: Calendar, color: "text-success bg-success/20" },
  { id: "prediction", label: "Prediction", icon: AlertTriangle, color: "text-accent bg-accent/20" },
];

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [selectedType, setSelectedType] = useState("trade");
  const [content, setContent] = useState("");
  const [cardName, setCardName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [risk, setRisk] = useState("medium");

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
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-foreground">Create Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Post Type */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Post Type</label>
            <div className="grid grid-cols-4 gap-2">
              {postTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center`}>
                    <type.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-foreground">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your trading tip..."
              className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none h-24"
            />
          </div>

          {/* Card Details */}
          <div className="p-4 bg-secondary/30 rounded-xl space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Card Details
            </h3>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Player/Card Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g., Mbappé TOTY"
                className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Buy Range</label>
                <input
                  type="text"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="e.g., 1.1M - 1.2M"
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Sell Target</label>
                <input
                  type="text"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="e.g., 1.4M+"
                  className="w-full p-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Risk Level</label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRisk(r)}
                    className={`flex-1 py-2 px-3 rounded-lg border capitalize transition-all ${
                      risk === r
                        ? r === "low"
                          ? "border-success bg-success/10 text-success"
                          : r === "medium"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-destructive bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <button className="w-full p-4 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground">
              <Image className="w-5 h-5" />
              Add Screenshot (optional)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-secondary/30">
          <p className="text-sm text-muted-foreground">
            {content.length}/500 characters
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="hero" disabled={!content || !cardName}>
              <Send className="w-4 h-4 mr-1" />
              Post
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
