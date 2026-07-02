import { Trophy, Clock, Coins, Zap, Route } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Pill, ProgressBar, StatTile } from '@/components/fc/primitives';
import { useObjectives, useRoadmap } from '@/hooks/useFcEdge';
import { formatCoins } from '@/lib/marketFormat';
import type { ObjectiveItem } from '@/lib/fcTypes';

export default function ObjectivesPage() {
  const { data, isLoading } = useObjectives();
  const { data: roadmap } = useRoadmap();

  return (
    <PageShell
      eyebrow="FC Edge · Objectives & Roadmap"
      title="Your best plan for today"
      subtitle="Objectives ranked by reward-per-minute, plus an auto-generated roadmap with a coin and XP forecast."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Roadmap */}
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <Route className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Today's Roadmap</h2>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <StatTile label="Coins" value={formatCoins(roadmap?.forecast.coinsToEarn ?? 0)} icon={<Coins className="h-4 w-4 text-yellow-300" />} />
            <StatTile label="XP" value={formatCoins(roadmap?.forecast.xpToEarn ?? 0)} icon={<Zap className="h-4 w-4 text-primary" />} />
            <StatTile label="Mins" value={roadmap?.forecast.estMinutes ?? 0} icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
          </div>
          <div className="space-y-2">
            {(roadmap?.tasks ?? []).map((t) => (
              <GlassCard key={t.id} className="p-3">
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{t.order}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.why} · {formatCoins(t.rewardValue)} · ~{t.estMinutes}m</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Grouped objectives */}
        <div className="space-y-6 lg:col-span-2">
          {isLoading ? (
            <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ) : (
            (['Daily', 'Weekly', 'Season'] as const).map((group) => (
              <section key={group}>
                <div className="mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-300" />
                  <h3 className="font-semibold text-foreground">{group}</h3>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {data?.groups[group]?.map((o) => <ObjectiveRow key={o.id} o={o} />)}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}

function ObjectiveRow({ o }: { o: ObjectiveItem }) {
  return (
    <GlassCard className="p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{o.name}</p>
        {o.priority != null && <Pill tone={o.priority > 25 ? 'primary' : 'muted'}>P{o.priority}</Pill>}
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{o.description}</p>
      <div className="mb-2"><ProgressBar value={o.progress} /></div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{o.rewardName}</span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-0.5"><Coins className="h-3 w-3" />{formatCoins(o.rewardValue)}</span>
          <span className="flex items-center gap-0.5"><Zap className="h-3 w-3" />{o.xp}</span>
        </span>
      </div>
    </GlassCard>
  );
}
