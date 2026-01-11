import { useState } from "react";
import { motion } from "framer-motion";
import { X, Star, TrendingUp, Users, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface BecomeTraderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BecomeTraderModal = ({ isOpen, onClose }: BecomeTraderModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: user?.username || "",
    specialty: "",
    tradingExperience: "",
    discordUsername: "",
    twitterHandle: "",
    monthlyPrice: "14.99",
    yearlyPrice: "149.99",
    bio: "",
    whyBeTrader: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Implement trader application API call
    try {
      // await api.applyAsTrader(formData);
      alert("Application submitted! We'll review and get back to you within 48 hours.");
      onClose();
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">Become a Trader</h2>
                <p className="text-sm text-muted-foreground">Share your expertise and earn</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`flex-1 h-1 rounded-full ${
                    step >= s ? "bg-primary" : "bg-secondary"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-4">Why become a trader?</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Earn Passive Income</p>
                      <p className="text-sm text-muted-foreground">Get paid monthly from subscribers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                    <Users className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Build Your Community</p>
                      <p className="text-sm text-muted-foreground">Grow your following and reputation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                    <Award className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Get Verified</p>
                      <p className="text-sm text-muted-foreground">Stand out with verification badge</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-foreground mb-4">Requirements</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-foreground">Proven trading track record</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-foreground">Active Discord presence</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-foreground">Commitment to quality content</span>
                  </div>
                </div>
              </div>

              <Button variant="hero" className="w-full" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Your Details</h3>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Display Name *</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g., FlipKingFC"
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Specialty *</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Select specialty</option>
                  <option value="Quick Flips">Quick Flips</option>
                  <option value="Market Analysis">Market Analysis</option>
                  <option value="SBC Solutions">SBC Solutions</option>
                  <option value="Icon Trading">Icon Trading</option>
                  <option value="Meta Predictions">Meta Predictions</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Trading Experience *</label>
                <select
                  value={formData.tradingExperience}
                  onChange={(e) => setFormData({ ...formData, tradingExperience: e.target.value })}
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Select experience</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Discord Username *</label>
                <input
                  type="text"
                  value={formData.discordUsername}
                  onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                  placeholder="username#1234"
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Twitter Handle (Optional)</label>
                <input
                  type="text"
                  value={formData.twitterHandle}
                  onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                  placeholder="@yourhandle"
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="hero" className="flex-1" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Pricing & Bio</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Monthly Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                    className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Yearly Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.yearlyPrice}
                    onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
                    className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell subscribers about your trading style and expertise..."
                  rows={4}
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Why do you want to be a trader? *</label>
                <textarea
                  value={formData.whyBeTrader}
                  onChange={(e) => setFormData({ ...formData, whyBeTrader: e.target.value })}
                  placeholder="Tell us why you'd be a great addition to Transfer Traders..."
                  rows={4}
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.displayName || !formData.specialty || !formData.bio || !formData.whyBeTrader}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BecomeTraderModal;
