import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, TrendingDown, Info, Radio } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import type { MarketIntelligence } from '@/lib/marketTypes';
import { useMarketIntelligence, useMarketHistory } from '@/hooks/useMarketIntelligence';
import { AiRatingGauge } from './AiRatingGauge';
import {
  formatCoins,
  formatPercent,
  changeColor,
  scoreColor,
  scoreHsl,
  RECOMMENDATION_STYLES,
  RISK_STYLES,
} from '@/lib/marketFormat';
import { cn } from '@/lib/utils';

interface IntelligenceDetailProps {
  item: MarketIntelligence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAlternative?: (item: MarketIntelligence) => void;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color: scoreHsl(value) }}>
          {value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: scoreHsl(value), boxShadow: `0 0 8px ${scoreHsl(value)}` }}
        />
      </div>
    </div>
  );
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

export function IntelligenceDetail({ item, open, onOpenChange, onSelectAlternative }: IntelligenceDetailProps) {
  // Fetch alternatives (and canonical reasons) lazily when a card is open.
  const { data } = useMarketIntelligence(open && item ? item.id : undefined);
  const { data: history } = useMarketHistory(open && item ? item.id : undefined);
  const intel = data?.intelligence ?? item;
  const alternatives = data?.alternatives ?? [];
  const chartData = (history?.history ?? []).map((p) => ({ t: p.time, price: p.price }));
  const isLive = (history?.dataQuality ?? intel?.dataQuality) === 'live';

  if (!intel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 to-accent/25">
            {intel.imageUrl ? (
              <img src={intel.imageUrl} alt={intel.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-2xl font-bold">{intel.rating}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{intel.name}</h2>
              <span
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase',
                  RECOMMENDATION_STYLES[intel.recommendation]
                )}
              >
                {intel.recommendation}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {intel.rating} · {intel.version} · {intel.position ?? '—'} · {intel.league ?? intel.nation ?? '—'}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold tabular-nums text-foreground">{formatCoins(intel.price)}</span>
              <span className={cn('flex items-center gap-1 text-sm font-medium', changeColor(intel.priceChange24h))}>
                {intel.priceChange24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {formatPercent(intel.priceChange24h)} 24h
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase',
                  isLive ? 'border-success/40 bg-success/10 text-success' : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300'
                )}
              >
                <Radio className="h-3 w-3" /> {isLive ? 'Live' : 'Est'}
              </span>
            </div>
          </div>
        </div>

        {/* Live price history */}
        {chartData.length > 1 && (
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="fcPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(185 90% 60%)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(185 90% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelFormatter={(t) => new Date(t as string).toLocaleString()}
                  formatter={(v) => [formatCoins(Number(v)), 'Price']}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(185 90% 60%)" strokeWidth={2} fill="url(#fcPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {!isLive && (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-400/20 bg-yellow-400/5 px-3 py-2 text-xs text-yellow-300/90">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Building live history — movement switches to live once 24h of price snapshots accrue for this card.
          </div>
        )}

        {/* Rating + scores */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex justify-center">
            <AiRatingGauge score={intel.investmentRating} label="Investment" size={140} strokeWidth={12} />
          </div>
          <div className="space-y-3">
            <ScoreBar label="Buy Score" value={intel.buyScore} />
            <ScoreBar label="Sell Score" value={intel.sellScore} />
            <ScoreBar label="Hold Score" value={intel.holdScore} />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI confidence <span className={cn('font-semibold', scoreColor(intel.confidence))}>{intel.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric label="Expected ROI">
            <span className={changeColor(intel.expectedRoi)}>{formatPercent(intel.expectedRoi)}</span>
          </Metric>
          <Metric label="Risk">
            <span className={RISK_STYLES[intel.risk]}>{intel.risk}</span>
          </Metric>
          <Metric label="Horizon">{intel.timeHorizon}</Metric>
          <Metric label="Est. Movement">
            <span className={changeColor(intel.expectedMovement)}>{formatPercent(intel.expectedMovement)}</span>
          </Metric>
          <Metric label="Suggested Buy">{formatCoins(intel.suggestedBuy)}</Metric>
          <Metric label="Suggested Sell">{formatCoins(intel.suggestedSell)}</Metric>
          <Metric label="Expected Peak">{formatCoins(intel.expectedPeak)}</Metric>
          <Metric label="BIN Range">
            {formatCoins(intel.lowestBin)}–{formatCoins(intel.highestBin)}
          </Metric>
        </div>

        {/* Microstructure meters */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ['Demand', intel.demand],
            ['Supply', intel.supply],
            ['Volatility', intel.volatility],
            ['Liquidity', intel.liquidity],
          ] as const).map(([label, val]) => (
            <ScoreBar key={label} label={label} value={val} />
          ))}
        </div>

        {/* Reasons */}
        {intel.reasons.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Why the AI says {intel.recommendation}
            </h3>
            <ul className="space-y-2">
              {intel.reasons.map((r, i) => (
                <li key={i} className="flex gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      r.sentiment === 'positive'
                        ? 'bg-success'
                        : r.sentiment === 'negative'
                        ? 'bg-destructive'
                        : 'bg-yellow-400'
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Alternative investments</h3>
            <div className="flex flex-col gap-1.5">
              {alternatives.map((alt) => (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => onSelectAlternative?.(alt)}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">{alt.name}</span>
                    <span className="text-xs text-muted-foreground">{alt.rating}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <span className="tabular-nums text-muted-foreground">{formatCoins(alt.price)}</span>
                    <span className={cn('font-bold tabular-nums', scoreColor(alt.investmentRating))}>
                      {alt.investmentRating}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-muted-foreground">
          FC Edge AI estimate · not financial advice · generated {new Date(intel.generatedAt).toLocaleTimeString()}
        </p>
      </DialogContent>
    </Dialog>
  );
}
