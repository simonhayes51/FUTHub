import type { Recommendation, Risk } from './marketTypes';

/** Format a coin value like 185000 -> "185K", 1250000 -> "1.25M". */
export function formatCoins(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(abs >= 100_000 ? 0 : 1)}K`;
  return String(Math.round(value));
}

/** Signed percentage, e.g. +8.8% / -4.2%. */
export function formatPercent(value: number | null | undefined, dp = 1): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(dp)}%`;
}

/** Tailwind text colour for a signed value. */
export function changeColor(value: number): string {
  if (value > 0.05) return 'text-success';
  if (value < -0.05) return 'text-destructive';
  return 'text-muted-foreground';
}

/** Colour ramp for a 0-100 score (red -> amber -> cyan -> green). */
export function scoreColor(score: number): string {
  if (score >= 75) return 'text-success';
  if (score >= 55) return 'text-primary';
  if (score >= 40) return 'text-yellow-400';
  return 'text-destructive';
}

export function scoreHsl(score: number): string {
  // Interpolate hue from red (0) through amber to green (145).
  const clamped = Math.max(0, Math.min(100, score));
  const hue = Math.round((clamped / 100) * 145);
  return `hsl(${hue} 80% 55%)`;
}

export const RECOMMENDATION_STYLES: Record<Recommendation, string> = {
  'STRONG BUY': 'bg-success/15 text-success border-success/30',
  BUY: 'bg-primary/15 text-primary border-primary/30',
  HOLD: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30',
  SELL: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  AVOID: 'bg-destructive/15 text-destructive border-destructive/30',
};

export const RISK_STYLES: Record<Risk, string> = {
  Low: 'text-success',
  Medium: 'text-yellow-300',
  High: 'text-destructive',
};
