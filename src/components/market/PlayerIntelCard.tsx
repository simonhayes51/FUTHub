import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MarketIntelligence } from '@/lib/marketTypes';
import {
  formatCoins,
  formatPercent,
  changeColor,
  scoreColor,
  RECOMMENDATION_STYLES,
} from '@/lib/marketFormat';
import { cn } from '@/lib/utils';

interface PlayerIntelCardProps {
  item: MarketIntelligence;
  onSelect?: (item: MarketIntelligence) => void;
}

/**
 * Compact, glassmorphic card summarising the AI view of a single player.
 * Used throughout the dashboard and scanner grids.
 */
export function PlayerIntelCard({ item, onSelect }: PlayerIntelCardProps) {
  const change = item.priceChange24h;
  const TrendIcon = change > 0.05 ? TrendingUp : change < -0.05 ? TrendingDown : Minus;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(item)}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group w-full text-left rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-colors hover:border-primary/40 hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="font-display text-lg font-bold text-foreground/80">{item.rating}</span>
          )}
          <span className="absolute -bottom-1 -right-1 rounded-md bg-background/90 px-1 text-[10px] font-bold text-primary">
            {item.rating}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-foreground">{item.name}</p>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                RECOMMENDATION_STYLES[item.recommendation]
              )}
            >
              {item.recommendation}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {item.version} · {item.position ?? '—'} · {item.league ?? item.nation ?? '—'}
          </p>

          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-lg font-bold tabular-nums text-foreground">{formatCoins(item.price)}</p>
              <p className={cn('flex items-center gap-1 text-xs font-medium', changeColor(change))}>
                <TrendIcon className="h-3 w-3" />
                {formatPercent(change)}
              </p>
            </div>
            <div className="text-right">
              <p className={cn('text-xl font-bold tabular-nums', scoreColor(item.investmentRating))}>
                {item.investmentRating}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Rating</p>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
