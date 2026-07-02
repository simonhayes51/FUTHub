import { useState } from 'react';
import { Clock, Repeat, CheckCircle2, XCircle, Layers } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Meter, Pill } from '@/components/fc/primitives';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSbcs, useSbc } from '@/hooks/useFcEdge';
import { formatCoins, changeColor } from '@/lib/marketFormat';
import type { SbcListItem } from '@/lib/fcTypes';
import { cn } from '@/lib/utils';

export default function SbcCentrePage() {
  const { data, isLoading } = useSbcs();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <PageShell
      eyebrow="FC Edge · SBC Centre"
      title="Which SBC should you complete?"
      subtitle="Every SBC solved by AI for the cheapest squad, with a live value rating and a should-I-complete verdict."
    >
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((sbc) => (
            <button key={sbc.id} type="button" onClick={() => setOpenId(sbc.id)} className="text-left">
              <SbcCard sbc={sbc} />
            </button>
          ))}
        </div>
      )}
      <SbcDetailDialog id={openId} onClose={() => setOpenId(null)} />
    </PageShell>
  );
}

function SbcCard({ sbc }: { sbc: SbcListItem }) {
  return (
    <GlassCard className="h-full transition-colors hover:border-primary/40">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{sbc.name}</p>
          <p className="text-xs text-muted-foreground">{sbc.category}</p>
        </div>
        {sbc.repeatable && <Pill tone="primary"><Repeat className="h-3 w-3" /> Repeatable</Pill>}
      </div>
      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{sbc.description}</p>

      <div className="mb-3"><Meter label="Value rating" value={sbc.valueRating} /></div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. cost</p>
          <p className="font-semibold text-foreground">{formatCoins(sbc.estimatedCost)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Reward</p>
          <p className="font-semibold text-foreground">{formatCoins(sbc.expectedReturn)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Profit</p>
          <p className={cn('font-semibold', changeColor(sbc.profit))}>{formatCoins(sbc.profit)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expires</p>
          <p className="flex items-center gap-1 font-semibold text-foreground"><Clock className="h-3 w-3" />{sbc.expiresInDays}d</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
        {sbc.shouldComplete ? (
          <Pill tone="success"><CheckCircle2 className="h-3 w-3" /> Worth it</Pill>
        ) : (
          <Pill tone="danger"><XCircle className="h-3 w-3" /> Skip</Pill>
        )}
        <span className="text-xs text-muted-foreground">{sbc.verdict}</span>
      </div>
    </GlassCard>
  );
}

function SbcDetailDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { data: sbc, isLoading } = useSbc(id ?? undefined);
  return (
    <Dialog open={Boolean(id)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl">
        {isLoading || !sbc ? (
          <p className="py-10 text-center text-muted-foreground">Solving cheapest squad…</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">{sbc.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{sbc.description}</p>

            <div className="grid grid-cols-3 gap-3">
              <StatBlock label="AI cheapest cost" value={formatCoins(sbc.estimatedCost)} />
              <StatBlock label="Reward value" value={formatCoins(sbc.expectedReturn)} />
              <StatBlock label="Profit" value={formatCoins(sbc.profit)} tone={sbc.profit} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Meter label="Value rating" value={sbc.valueRating} />
              <Meter label="Difficulty" value={sbc.difficulty} />
            </div>

            <div className={cn('rounded-lg border px-3 py-2 text-sm', sbc.shouldComplete ? 'border-success/30 bg-success/5 text-success' : 'border-destructive/30 bg-destructive/5 text-destructive')}>
              {sbc.verdict}
            </div>

            <div className="space-y-4">
              {sbc.solution.segments.map((seg, i) => (
                <div key={i}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">{seg.label}</span>
                    <span className="text-muted-foreground">
                      {seg.players} players · target {seg.targetRating} · got {seg.achievedRating} · {formatCoins(seg.cost)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {seg.slots.map((slot, j) => (
                      <span key={j} className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs">
                        <span className="font-bold text-primary">{slot.rating}</span>{' '}
                        <span className="text-muted-foreground">{formatCoins(slot.price)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-muted-foreground">Solution priced from the live market · fodder prices update every few minutes.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatBlock({ label, value, tone }: { label: string; value: string; tone?: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-lg font-bold', tone != null ? changeColor(tone) : 'text-foreground')}>{value}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      ))}
    </div>
  );
}
