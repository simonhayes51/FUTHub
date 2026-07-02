import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Sparkles, TrendingUp, TrendingDown, Gauge } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { PlayerIntelCard } from '@/components/market/PlayerIntelCard';
import { IntelligenceDetail } from '@/components/market/IntelligenceDetail';
import { AiRatingGauge } from '@/components/market/AiRatingGauge';
import {
  useMarketOverview,
  useMarketScanner,
  useScannerCategories,
} from '@/hooks/useMarketIntelligence';
import type { MarketIntelligence } from '@/lib/marketTypes';
import { formatPercent, changeColor } from '@/lib/marketFormat';
import { cn } from '@/lib/utils';

const SENTIMENT_COLOR: Record<string, string> = {
  Bullish: 'text-success',
  Bearish: 'text-destructive',
  Neutral: 'text-yellow-300',
};

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      ))}
    </div>
  );
}

export default function MarketIntelligencePage() {
  const [selected, setSelected] = useState<MarketIntelligence | null>(null);
  const [category, setCategory] = useState('best-investments');

  const { data: overview, isLoading: overviewLoading } = useMarketOverview();
  const { data: categories } = useScannerCategories();
  const { data: scanner, isLoading: scannerLoading } = useMarketScanner(category, 24);

  const heat = overview?.overview;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Ambient gradient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <main className="container mx-auto px-4 pb-24 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> FC Edge AI · Market Intelligence
          </div>
          <h1 className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text font-display text-3xl font-bold text-transparent sm:text-4xl">
            What should you buy today?
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Live AI scoring across the market — buy, sell and hold signals, projected ROI and risk for
            every card, so you always trade with an edge.
          </p>
        </div>

        {/* Market heat overview */}
        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Gauge className="h-4 w-4 text-primary" /> Market Heat Index
            </div>
            <div className="mt-3 flex items-center gap-4">
              <AiRatingGauge score={heat?.heatIndex ?? 0} label="Heat" size={110} strokeWidth={10} />
              <div>
                <p className={cn('text-2xl font-bold', SENTIMENT_COLOR[heat?.sentiment ?? 'Neutral'])}>
                  {heat?.sentiment ?? '—'}
                </p>
                <p className="text-xs text-muted-foreground">Avg AI rating {heat?.avgInvestmentRating ?? '—'}</p>
                <p className="mt-1 text-xs text-muted-foreground">{heat?.total ?? 0} cards scanned</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Rising', value: heat?.rising, icon: TrendingUp, color: 'text-success' },
              { label: 'Stable', value: heat?.stable, icon: Activity, color: 'text-yellow-300' },
              { label: 'Falling', value: heat?.falling, icon: TrendingDown, color: 'text-destructive' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <Icon className={cn('h-5 w-5', color)} />
                <div>
                  <p className={cn('text-3xl font-bold tabular-nums', color)}>
                    {overviewLoading ? '—' : value ?? 0}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top picks */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Today&apos;s Top AI Picks</h2>
          </div>
          {overviewLoading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {overview?.topPicks.map((item) => (
                <PlayerIntelCard key={item.id} item={item} onSelect={setSelected} />
              ))}
            </div>
          )}
        </section>

        {/* Movers */}
        {overview && (overview.risers.length > 0 || overview.fallers.length > 0) && (
          <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[
              { title: 'Fastest Risers', icon: TrendingUp, items: overview.risers },
              { title: 'Fastest Fallers', icon: TrendingDown, items: overview.fallers },
            ].map(({ title, icon: Icon, items }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon className="h-4 w-4 text-primary" /> {title}
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelected(item)}
                      className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-primary"
                    >
                      <span className="truncate text-sm text-foreground">
                        {item.name} <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </span>
                      <span className={cn('text-sm font-semibold tabular-nums', changeColor(item.priceChange24h))}>
                        {formatPercent(item.priceChange24h)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Market scanner */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Market Scanner</h2>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {(categories?.categories ?? []).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                title={cat.description}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                  category === cat.id
                    ? 'border-primary/50 bg-primary/15 text-primary shadow-[0_0_20px_hsl(185_90%_60%/0.15)]'
                    : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {scanner?.description && (
            <p className="mb-4 text-sm text-muted-foreground">{scanner.description}</p>
          )}

          {scannerLoading ? (
            <SkeletonGrid count={9} />
          ) : (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {scanner?.items.map((item) => (
                <PlayerIntelCard key={item.id} item={item} onSelect={setSelected} />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <IntelligenceDetail
        item={selected}
        open={Boolean(selected)}
        onOpenChange={(o) => !o && setSelected(null)}
        onSelectAlternative={(alt) => setSelected(alt)}
      />
    </div>
  );
}
