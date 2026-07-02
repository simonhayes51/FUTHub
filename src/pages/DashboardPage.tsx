import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Sparkles, Trophy, Layers, Newspaper, ArrowRight,
} from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, StatTile, Pill, ProgressBar } from '@/components/fc/primitives';
import { PlayerIntelCard } from '@/components/market/PlayerIntelCard';
import { IntelligenceDetail } from '@/components/market/IntelligenceDetail';
import { AiRatingGauge } from '@/components/market/AiRatingGauge';
import { useDashboard } from '@/hooks/useFcEdge';
import { useAuth } from '@/contexts/AuthContext';
import { formatCoins, formatPercent, changeColor } from '@/lib/marketFormat';
import type { MarketIntelligence } from '@/lib/marketTypes';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(user?.username);
  const [selected, setSelected] = useState<MarketIntelligence | null>(null);
  const ov = data?.overview;

  return (
    <PageShell
      eyebrow="FC Edge · Command Centre"
      title={isLoading ? 'Loading your dashboard…' : data?.greeting ?? 'Welcome back'}
      subtitle="Everything that matters today — market, SBCs, objectives and news in one place."
    >
      {/* Personal assistant digest */}
      <GlassCard className="mb-8 border-primary/20 bg-primary/[0.04]">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" /> Your daily briefing
        </div>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {(data?.assistant ?? []).map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {line}
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* Market snapshot */}
      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassCard className="col-span-2 flex items-center gap-4 lg:col-span-1">
          <AiRatingGauge score={ov?.heatIndex ?? 0} label="Heat" size={92} strokeWidth={9} />
          <div>
            <p className="text-lg font-bold text-foreground">{ov?.sentiment ?? '—'}</p>
            <p className="text-xs text-muted-foreground">Market sentiment</p>
          </div>
        </GlassCard>
        <StatTile label="Rising" value={ov?.rising ?? 0} accent="text-success" icon={<TrendingUp className="h-4 w-4 text-success" />} />
        <StatTile label="Falling" value={ov?.falling ?? 0} accent="text-destructive" icon={<TrendingDown className="h-4 w-4 text-destructive" />} />
        <StatTile label="Avg AI Rating" value={ov?.avgInvestmentRating ?? 0} icon={<Activity className="h-4 w-4 text-primary" />} />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Top picks */}
        <section className="lg:col-span-2">
          <SectionHeader icon={<Sparkles className="h-5 w-5 text-accent" />} title="Today's Top AI Picks" to="/market" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(data?.topPicks ?? []).map((item) => (
              <PlayerIntelCard key={item.id} item={item} onSelect={setSelected} />
            ))}
          </div>
        </section>

        {/* Side column: SBCs + objectives */}
        <div className="space-y-8">
          <section>
            <SectionHeader icon={<Layers className="h-5 w-5 text-primary" />} title="Latest SBCs" to="/sbc" />
            <div className="space-y-2">
              {(data?.sbcs ?? []).map((s) => (
                <Link key={s.id} to="/sbc" className="block">
                  <GlassCard className="flex items-center justify-between p-3 transition-colors hover:border-primary/40">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Reward ≈ {formatCoins(s.rewardValue)} · {s.expiresInDays}d left</p>
                    </div>
                    {s.repeatable && <Pill tone="primary">Repeatable</Pill>}
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader icon={<Trophy className="h-5 w-5 text-yellow-300" />} title="Priority Objectives" to="/objectives" />
            <div className="space-y-2">
              {(data?.objectives ?? []).map((o) => (
                <GlassCard key={o.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-foreground">{o.name}</p>
                    <span className="text-xs text-muted-foreground">{formatCoins(o.rewardValue)}</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={o.progress} /></div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* News */}
      <section className="mt-8">
        <SectionHeader icon={<Newspaper className="h-5 w-5 text-primary" />} title="Market News" to="/news" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(data?.news ?? []).map((n) => (
            <GlassCard key={n.id} className="p-3">
              <div className="mb-1 flex items-center gap-2">
                <Pill tone={n.impact === 'high' ? 'danger' : n.impact === 'medium' ? 'warning' : 'muted'}>{n.category}</Pill>
                <span className="text-xs text-muted-foreground">{n.hoursAgo}h ago</span>
              </div>
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.summary}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <IntelligenceDetail
        item={selected}
        open={Boolean(selected)}
        onOpenChange={(o) => !o && setSelected(null)}
        onSelectAlternative={(alt) => setSelected(alt)}
      />
    </PageShell>
  );
}

function SectionHeader({ icon, title, to }: { icon: React.ReactNode; title: string; to?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      {to && (
        <Link to={to} className={cn('flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary')}>
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
