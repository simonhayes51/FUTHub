import TraderCard from "./TraderCard";
import { useTraders } from "@/hooks/useTraders";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedTraders = () => {
  // Fetch featured traders from API
  const { data: traders = [], isLoading, error } = useTraders({ featured: true });
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
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-4">
                <Skeleton className="w-20 h-20 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full p-8 rounded-xl border border-destructive/50 bg-destructive/10 text-center">
              <p className="text-destructive font-medium">Failed to load traders</p>
            </div>
          ) : traders.length === 0 ? (
            // Empty state
            <div className="col-span-full p-8 rounded-xl border border-border bg-card text-center">
              <p className="text-muted-foreground">No featured traders available</p>
            </div>
          ) : (
            // Traders
            traders.map((trader: any, index: number) => (
              <TraderCard key={trader.id || index} {...trader} />
            ))
          )}
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
