import { 
  Search, 
  LineChart, 
  Calculator, 
  Users, 
  Bell, 
  Bookmark,
  TrendingUp,
  Layers
} from "lucide-react";

const tools = [
  {
    icon: Search,
    name: "Price Checker",
    description: "Real-time market prices across all platforms",
    color: "text-primary",
  },
  {
    icon: LineChart,
    name: "Price History",
    description: "Historical charts & trend analysis",
    color: "text-success",
  },
  {
    icon: Calculator,
    name: "SBC Solver",
    description: "Find the cheapest solutions instantly",
    color: "text-accent",
  },
  {
    icon: Users,
    name: "Squad Builder",
    description: "Build & optimize your dream team",
    color: "text-primary",
  },
  {
    icon: Bell,
    name: "Price Alerts",
    description: "Get notified when prices hit targets",
    color: "text-destructive",
  },
  {
    icon: Bookmark,
    name: "Watchlist",
    description: "Track your investment opportunities",
    color: "text-success",
  },
  {
    icon: TrendingUp,
    name: "Meta Tracker",
    description: "Popular cards & formation trends",
    color: "text-accent",
  },
  {
    icon: Layers,
    name: "Compare Tool",
    description: "Side-by-side player comparisons",
    color: "text-primary",
  },
];

const ToolsSection = () => {
  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Built-In Tools
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything You <span className="text-gradient-primary">Need</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional trading tools integrated directly into the platform. No external apps needed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer card-hover"
            >
              <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
