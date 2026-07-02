import { useState } from 'react';
import { Newspaper, Flame } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Pill } from '@/components/fc/primitives';
import { useNews } from '@/hooks/useFcEdge';
import { cn } from '@/lib/utils';

export default function NewsPage() {
  const [category, setCategory] = useState('All');
  const { data, isLoading } = useNews(category);

  return (
    <PageShell
      eyebrow="FC Edge · News Centre"
      title="Everything moving the market"
      subtitle="Promos, leaks, SBCs, objectives and market news — with an impact flag on each story."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {(data?.categories ?? ['All']).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
              category === c ? 'border-primary/50 bg-primary/15 text-primary' : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.items.map((n) => (
            <GlassCard key={n.id} className="transition-colors hover:border-primary/40">
              <div className="mb-1 flex items-center gap-2">
                <Pill tone={n.impact === 'high' ? 'danger' : n.impact === 'medium' ? 'warning' : 'muted'}>
                  {n.impact === 'high' && <Flame className="h-3 w-3" />} {n.category}
                </Pill>
                <span className="text-xs text-muted-foreground">{n.hoursAgo}h ago</span>
              </div>
              <div className="flex items-start gap-3">
                <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.summary}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
