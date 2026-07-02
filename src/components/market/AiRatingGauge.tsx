import { scoreHsl } from '@/lib/marketFormat';
import { cn } from '@/lib/utils';

interface AiRatingGaugeProps {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  suffix?: string;
  className?: string;
}

/**
 * Circular progress gauge for a 0-100 score. The stroke colour ramps from red
 * (low) through amber to green (high) so the number reads at a glance.
 */
export function AiRatingGauge({
  score,
  label,
  size = 120,
  strokeWidth = 10,
  suffix = '',
  className,
}: AiRatingGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = scoreHsl(clamped);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(0 0% 100% / 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color }}>
          {Math.round(clamped)}
          {suffix}
        </span>
        {label && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
