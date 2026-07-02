import { Dna, Gift, Star, TrendingUp } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Meter, Pill } from '@/components/fc/primitives';
import { useEvolutions } from '@/hooks/useFcEdge';
import { formatCoins } from '@/lib/marketFormat';

export default function EvolutionsPage() {
  const { data, isLoading } = useEvolutions();

  return (
    <PageShell
      eyebrow="FC Edge · Evolution Centre"
      title="Which Evolution is worth it?"
      subtitle="Every Evolution with its best eligible players from the live market and a value rating."
    >
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data?.items.map((evo) => (
            <GlassCard key={evo.id} className="transition-colors hover:border-primary/40">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-foreground">{evo.name}</p>
                    <p className="text-xs text-muted-foreground">{evo.levels} levels</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {evo.isFree ? <Pill tone="success"><Gift className="h-3 w-3" /> Free</Pill> : <Pill tone="muted">{formatCoins(evo.costCoins)}{evo.costPoints ? ` / ${evo.costPoints}FP` : ''}</Pill>}
                  {evo.recommended && <Pill tone="primary"><Star className="h-3 w-3" /> Meta</Pill>}
                </div>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{evo.description}</p>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {evo.upgrades.map((u) => (
                  <span key={u} className="rounded-md border border-success/20 bg-success/5 px-2 py-0.5 text-[11px] text-success">
                    <TrendingUp className="mr-1 inline h-3 w-3" />{u}
                  </span>
                ))}
              </div>

              <div className="mb-3 grid grid-cols-2 gap-4">
                <Meter label="Value rating" value={evo.valueRating} />
                <Meter label="Meta score" value={evo.metaScore} />
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-sm">
                <span className="text-xs text-muted-foreground">{evo.candidateCount} eligible players</span>
                {evo.cheapestEntry && (
                  <span className="text-foreground">
                    Cheapest: <span className="font-medium">{evo.cheapestEntry.name}</span>{' '}
                    <span className="text-muted-foreground">({evo.cheapestEntry.rating}) {formatCoins(evo.cheapestEntry.price)}</span>
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
