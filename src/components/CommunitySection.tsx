import { MessageSquare, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const communityHighlights = [
  {
    icon: Users,
    title: "Trader Circles",
    description: "Join groups organized by play style, region, or market focus.",
  },
  {
    icon: Sparkles,
    title: "Weekly Challenges",
    description: "Compete in themed flips and earn leaderboard rewards.",
  },
  {
    icon: MessageSquare,
    title: "Live Q&A",
    description: "Ask top traders about market swings and upcoming promos.",
  },
];

const CommunitySection = () => {
  return (
    <section id="community" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Community Hub
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Connect with <span className="text-gradient-primary">Elite Traders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share strategies, get feedback, and stay plugged into the FC26 market with an active community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {communityHighlights.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/feed?tab=discover">
            <Button variant="hero" size="lg">
              Explore the Community
            </Button>
          </Link>
          <Link to="/feed?tab=profile">
            <Button variant="outline" size="lg">
              Start Your Trader Profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
