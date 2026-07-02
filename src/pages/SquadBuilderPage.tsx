import { useState } from 'react';
import { Users, Coins, Link2, Trophy } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Pill } from '@/components/fc/primitives';
import { useSquads } from '@/hooks/useFcEdge';
import { formatCoins } from '@/lib/marketFormat';
import type { SquadItem, SquadSlotPriced } from '@/lib/fcTypes';
import { cn } from '@/lib/utils';

const BUDGETS = ['All', 'Budget', 'Mid', 'Meta', 'Endgame'];
const LINES: Record<string, string[]> = {
  ATT: ['LW', 'ST', 'RW', 'CF', 'LF', 'RF'],
  MID: ['CM', 'CDM', 'CAM', 'LM', 'RM'],
  DEF: ['LB', 'CB', 'RB', 'LWB', 'RWB'],
  GK: ['GK'],
};

export default function SquadBuilderPage() {
  const [budget, setBudget] = useState('All');
  const { data, isLoading } = useSquads(budget === 'All' ? undefined : budget);

  return (
    <PageShell
      eyebrow="FC Edge · Squad Builder"
      title="AI meta squads for any budget"
      subtitle="Ready-made meta XIs priced live from the market, with formation, chemistry and playstyle."
      actions={
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
                budget === b ? 'border-primary/50 bg-primary/15 text-primary' : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground'
              )}
            >
              {b}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data?.items.map((squad) => <SquadCard key={squad.id} squad={squad} />)}
        </div>
      )}
    </PageShell>
  );
}

function lineFor(position: string): keyof typeof LINES {
  for (const [line, positions] of Object.entries(LINES)) {
    if (positions.includes(position)) return line as keyof typeof LINES;
  }
  return 'MID';
}

function SquadCard({ squad }: { squad: SquadItem }) {
  const lines: Record<string, SquadSlotPriced[]> = { ATT: [], MID: [], DEF: [], GK: [] };
  squad.slots.forEach((s) => lines[lineFor(s.position)].push(s));

  return (
    <GlassCard>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground">{squad.name}</p>
            <p className="text-xs text-muted-foreground">{squad.formation} · {squad.playstyle}</p>
          </div>
        </div>
        <Pill tone="primary">{squad.budgetTier}</Pill>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <Mini icon={<Trophy className="h-3.5 w-3.5" />} label="Rating" value={String(squad.rating)} />
        <Mini icon={<Link2 className="h-3.5 w-3.5" />} label="Chemistry" value={`${squad.chemistry}/33`} />
        <Mini icon={<Coins className="h-3.5 w-3.5" />} label="Est. cost" value={formatCoins(squad.estCost)} />
      </div>

      {/* Pitch */}
      <div className="space-y-2 rounded-xl border border-white/[0.06] bg-gradient-to-b from-success/[0.04] to-transparent p-3">
        {(['ATT', 'MID', 'DEF', 'GK'] as const).map((line) => (
          <div key={line} className="flex flex-wrap justify-center gap-1.5">
            {lines[line].map((slot, i) => (
              <span key={i} className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-center text-xs">
                <span className="mr-1 text-[10px] text-muted-foreground">{slot.position}</span>
                <span className="font-bold text-primary">{slot.rating}</span>
                <span className="ml-1 text-muted-foreground">{formatCoins(slot.price)}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
      <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">{icon}{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
