import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Check } from "lucide-react";

const benefits = [
  "Free to start trading",
  "Cancel anytime",
  "Verified results only",
  "24/7 market alerts",
];

const CTASection = () => {
  return (
    <section id="pricing" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-gold/10 border border-accent/30 mb-8">
            <span className="text-accent font-semibold">Limited Time</span>
            <span className="text-sm text-muted-foreground">First month 50% off</span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient-primary">Dominate</span> the Market?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of smart traders who are already maximizing their FC26 coin profits with verified expert tips.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border"
              >
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/feed?tab=discover">
              <Button variant="hero" size="xl" className="min-w-[200px]">
                <Zap className="w-5 h-5" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/feed?tab=discover">
              <Button variant="glass" size="xl" className="min-w-[200px]">
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
