import TraderCard from "./TraderCard";

const traders = [
  {
    name: "FlipKingFC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    specialty: "Quick Flips & Sniping",
    winRate: 94,
    avgROI: "+32%",
    subscribers: "4.2K",
    verified: true,
    price: "£14.99",
    featured: true,
  },
  {
    name: "SBCMaster",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    specialty: "SBC Investments",
    winRate: 88,
    avgROI: "+28%",
    subscribers: "2.8K",
    verified: true,
    price: "£9.99",
    featured: false,
  },
  {
    name: "MetaTraderPro",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    specialty: "Meta Predictions",
    winRate: 91,
    avgROI: "+45%",
    subscribers: "5.1K",
    verified: true,
    price: "£19.99",
    featured: true,
  },
  {
    name: "IconInvestor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    specialty: "Icon Trading",
    winRate: 86,
    avgROI: "+24%",
    subscribers: "1.9K",
    verified: true,
    price: "£12.99",
    featured: false,
  },
];

const FeaturedTraders = () => {
  return (
    <section id="traders" className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Top Performers
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-gradient-primary">Traders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow verified experts with proven track records. Every tip is backed by real data and verified results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {traders.map((trader, index) => (
            <TraderCard key={index} {...trader} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#"
            className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-2"
          >
            View All 500+ Traders →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTraders;
