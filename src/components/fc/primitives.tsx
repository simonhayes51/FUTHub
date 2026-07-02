import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { scoreHsl } from '@/lib/marketFormat';

export function GlassCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl', className)}>
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
  icon?: ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col justify-between">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="mt-2">
        <p className={cn('text-2xl font-bold tabular-nums', accent ?? 'text-foreground')}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </GlassCard>
  );
}

/** Horizontal 0-100 meter with a ramped colour. */
export function Meter({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums" style={{ color: scoreHsl(v) }}>
          {Math.round(v)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${v}%`, background: scoreHsl(v), boxShadow: `0 0 8px ${scoreHsl(v)}` }}
        />
      </div>
    </div>
  );
}

export function Pill({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'primary' | 'success' | 'danger' | 'warning' }) {
  const tones: Record<string, string> = {
    muted: 'border-white/10 bg-white/[0.04] text-muted-foreground',
    primary: 'border-primary/30 bg-primary/10 text-primary',
    success: 'border-success/30 bg-success/10 text-success',
    danger: 'border-destructive/30 bg-destructive/10 text-destructive',
    warning: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value * 100));
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-muted-foreground">{children}</div>;
}
