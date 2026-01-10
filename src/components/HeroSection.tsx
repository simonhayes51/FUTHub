import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, TrendingUp, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Live Trading Platform</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">FC26</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Trade Smarter with
            <span className="block text-gradient-primary">Verified Experts</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Follow elite FC26 traders, access premium market insights, and maximize your coin profits with real-time tips backed by verified results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/feed">
              <Button variant="hero" size="xl">
                <Zap className="w-5 h-5" />
                Start Trading Free
              </Button>
            </Link>
            <Link to="/feed">
              <Button variant="glass" size="xl">
                Explore Traders
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl md:text-3xl font-bold">12K+</span>
              </div>
              <span className="text-sm text-muted-foreground">Active Traders</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="font-display text-2xl md:text-3xl font-bold">89%</span>
              </div>
              <span className="text-sm text-muted-foreground">Avg Win Rate</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="font-display text-2xl md:text-3xl font-bold">500+</span>
              </div>
              <span className="text-sm text-muted-foreground">Verified Traders</span>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl md:text-3xl font-bold">2.4M</span>
              </div>
              <span className="text-sm text-muted-foreground">Coins Earned</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
