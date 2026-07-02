import { useState } from 'react';
import { Package, Dices, Coins, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Pill } from '@/components/fc/primitives';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { usePacks, useSimulatePack } from '@/hooks/useFcEdge';
import { formatCoins, formatPercent, changeColor } from '@/lib/marketFormat';
import type { PackItem, PackSimResult } from '@/lib/fcTypes';
import { cn } from '@/lib/utils';

export default function PackCentrePage() {
  const { data, isLoading } = usePacks();
  const [simPack, setSimPack] = useState<PackItem | null>(null);

  return (
    <PageShell
      eyebrow="FC Edge · Pack Centre"
      title="Should you open, or buy the market?"
      subtitle="Pack odds, expected value versus the coin price, and a reproducible pack simulator."
    >
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data?.items.map((pack) => (
            <PackCard key={pack.id} pack={pack} onSimulate={() => setSimPack(pack)} />
          ))}
        </div>
      )}
      <SimulatorDialog pack={simPack} onClose={() => setSimPack(null)} />
    </PageShell>
  );
}

function PackCard({ pack, onSimulate }: { pack: PackItem; onSimulate: () => void }) {
  const positiveEv = (pack.evVsCoinsPercent ?? -100) > 0;
  return (
    <GlassCard>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground">{pack.name}</p>
            <p className="text-xs text-muted-foreground">
              {pack.priceCoins ? `${formatCoins(pack.priceCoins)} coins` : 'Points only'}
              {pack.pricePoints ? ` · ${pack.pricePoints} FP` : ''}
            </p>
          </div>
        </div>
        <Pill tone={positiveEv ? 'success' : 'danger'}>{pack.evVsCoinsPercent == null ? 'n/a' : formatPercent(pack.evVsCoinsPercent, 0)} EV</Pill>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <Mini label="Expected value" value={formatCoins(pack.expectedValue)} />
        <Mini label="Rare items" value={String(pack.rareCount)} />
        <Mini label="Chance of 88+" value={`${pack.chanceOf88}%`} />
      </div>

      {/* Odds bar */}
      <div className="mb-3">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Rating odds per rare slot</div>
        <div className="flex h-3 overflow-hidden rounded-full">
          {pack.tiers.map((t, i) => (
            <div
              key={t.label}
              title={`${t.label}: ${(t.probability * 100).toFixed(1)}%`}
              style={{ width: `${t.probability * 100}%`, background: `hsl(${185 + i * 20} 80% 55%)` }}
            />
          ))}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
          {pack.tiers.map((t) => (
            <span key={t.label}>{t.label}: {(t.probability * 100).toFixed(1)}%</span>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{pack.verdict}</p>
      <Button variant="outline" className="w-full" onClick={onSimulate}>
        <Dices className="mr-2 h-4 w-4" /> Simulate pack
      </Button>
    </GlassCard>
  );
}

function SimulatorDialog({ pack, onClose }: { pack: PackItem | null; onClose: () => void }) {
  const sim = useSimulatePack();
  const [result, setResult] = useState<PackSimResult | null>(null);

  const run = (count: number) => {
    if (!pack) return;
    sim.mutate(
      { id: pack.id, count, seed: String(Date.now()) },
      { onSuccess: setResult }
    );
  };

  return (
    <Dialog open={Boolean(pack)} onOpenChange={(o) => { if (!o) { onClose(); setResult(null); } }}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <Dices className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">{pack?.name} — Simulator</h2>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => run(1)} disabled={sim.isPending}>Open 1</Button>
          <Button size="sm" variant="outline" onClick={() => run(10)} disabled={sim.isPending}>Open 10</Button>
          <Button size="sm" variant="outline" onClick={() => run(25)} disabled={sim.isPending}>Open 25</Button>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Mini label="Total value" value={formatCoins(result.totalValue)} />
              <Mini label="Net vs cost" value={result.netProfit == null ? 'n/a' : formatCoins(result.netProfit)} tone={result.netProfit ?? undefined} />
              <Mini label="Best pull" value={String(result.bestPull)} />
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {result.opens.map((items, oi) => (
                <div key={oi}>
                  {result.opens.length > 1 && <p className="mb-1 text-[10px] uppercase text-muted-foreground">Pack {oi + 1}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((it, i) => (
                      <span
                        key={i}
                        className={cn(
                          'rounded-lg border px-2 py-1 text-xs',
                          it.isWalkout ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300' : 'border-white/10 bg-white/[0.03] text-foreground'
                        )}
                      >
                        {it.isWalkout && <Sparkles className="mr-1 inline h-3 w-3" />}
                        <span className="font-bold">{it.rating}</span> · {formatCoins(it.value)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-muted-foreground">
              <Coins className="mr-1 inline h-3 w-3" /> Simulated from published odds — real packs vary. Not affiliated with EA.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('text-sm font-bold', tone != null ? changeColor(tone) : 'text-foreground')}>{value}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      ))}
    </div>
  );
}
