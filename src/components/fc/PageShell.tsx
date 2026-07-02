import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface PageShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Shared FC Edge page frame: navbar, ambient gradient backdrop and header. */
export function PageShell({ eyebrow, title, subtitle, actions, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <main className="container mx-auto px-4 pb-24 pt-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
              </div>
            )}
            <h1 className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text font-display text-3xl font-bold text-transparent sm:text-4xl">
              {title}
            </h1>
            {subtitle && <p className="mt-1 max-w-2xl text-muted-foreground">{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
