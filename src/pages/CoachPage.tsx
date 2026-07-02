import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User as UserIcon } from 'lucide-react';
import { PageShell } from '@/components/fc/PageShell';
import { GlassCard, Pill } from '@/components/fc/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCoach } from '@/hooks/useFcEdge';
import { formatCoins, formatPercent, changeColor, scoreColor } from '@/lib/marketFormat';
import type { CoachResponse } from '@/lib/fcTypes';
import { cn } from '@/lib/utils';

interface ChatTurn {
  role: 'user' | 'coach';
  text: string;
  data?: CoachResponse['data'];
}

const SUGGESTIONS = [
  'What should I invest in?',
  'Which SBC is worth doing?',
  'How do I make 500k?',
  'What should I sell?',
  "What are today's objectives?",
];

export default function CoachPage() {
  const coach = useCoach();
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<ChatTurn[]>([
    { role: 'coach', text: "Hi, I'm your FC Edge AI Coach. Ask me what to buy, what to sell, which SBC is worth doing, or how to make coins — I'll answer using live market data." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [turns, coach.isPending]);

  const send = (message: string) => {
    const msg = message.trim();
    if (!msg || coach.isPending) return;
    setTurns((t) => [...t, { role: 'user', text: msg }]);
    setInput('');
    coach.mutate(msg, {
      onSuccess: (res) => setTurns((t) => [...t, { role: 'coach', text: res.answer, data: res.data }]),
      onError: () => setTurns((t) => [...t, { role: 'coach', text: 'Sorry, I could not reach the market data just now. Try again.' }]),
    });
  };

  return (
    <PageShell eyebrow="FC Edge · AI Coach" title="Ask the AI Coach" subtitle="Your personal Ultimate Team analyst, powered by live market intelligence.">
      <div className="mx-auto max-w-3xl">
        <GlassCard className="mb-4 flex h-[60vh] flex-col p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {turns.map((turn, i) => (
              <div key={i} className={cn('flex gap-3', turn.role === 'user' && 'flex-row-reverse')}>
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', turn.role === 'coach' ? 'bg-gradient-to-br from-primary to-accent' : 'bg-white/10')}>
                  {turn.role === 'coach' ? <Bot className="h-4 w-4 text-background" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div className={cn('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm', turn.role === 'coach' ? 'bg-white/[0.05] text-foreground' : 'bg-primary/15 text-foreground')}>
                  <p className="whitespace-pre-line">{renderBold(turn.text)}</p>
                  {turn.data && <CoachData data={turn.data} />}
                </div>
              </div>
            ))}
            {coach.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4 animate-pulse text-primary" /> Analysing the market…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your Ultimate Team…" className="bg-white/[0.03]" />
              <Button type="submit" disabled={coach.isPending || !input.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </GlassCard>
        <p className="text-center text-[10px] text-muted-foreground"><Sparkles className="mr-1 inline h-3 w-3" />AI estimates from live data · not financial advice.</p>
      </div>
    </PageShell>
  );
}

function CoachData({ data }: { data: CoachResponse['data'] }) {
  if (!data) return null;
  return (
    <div className="mt-3 space-y-1.5">
      {data.cards?.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5">
          <span className="text-xs"><span className="font-medium text-foreground">{c.name}</span> <span className="text-muted-foreground">{c.rating}</span></span>
          <span className="flex items-center gap-2 text-xs">
            <span className="tabular-nums text-muted-foreground">{formatCoins(c.price)}</span>
            <Pill tone={c.recommendation.includes('BUY') ? 'success' : c.recommendation === 'SELL' ? 'danger' : 'muted'}>{c.recommendation}</Pill>
            <span className={cn('font-bold', scoreColor(c.investmentRating))}>{c.investmentRating}</span>
          </span>
        </div>
      ))}
      {data.sbcs?.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-xs">
          <span className="font-medium text-foreground">{s.name}</span>
          <span className="text-muted-foreground">{formatCoins(s.rewardValue)} · {s.expiresInDays}d</span>
        </div>
      ))}
      {data.objectives?.map((o) => (
        <div key={o.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-xs">
          <span className="font-medium text-foreground">{o.name}</span>
          <span className="text-muted-foreground">{formatCoins(o.rewardValue)}</span>
        </div>
      ))}
    </div>
  );
}

/** Render **bold** markers as <strong>. */
function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="text-primary">{part.slice(2, -2)}</strong> : part
  );
}
