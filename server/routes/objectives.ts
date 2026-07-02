import { Router, Request, Response } from 'express';
import { OBJECTIVES, type Objective } from '../lib/fcFixtures.js';

const router = Router();

/** Priority score: coins-per-minute + XP, weighted by how close to done it is. */
function priority(o: Objective): number {
  const coinsPerMin = o.rewardValue / Math.max(1, o.estMinutes);
  const nearlyDone = o.progress > 0 && o.progress < 1 ? 15 : 0;
  return Math.round(coinsPerMin * 2 + o.xp / 100 + nearlyDone);
}

/** GET /api/objectives — grouped objectives with AI priority. */
router.get('/', (_req: Request, res: Response) => {
  const items = OBJECTIVES.map((o) => ({ ...o, priority: priority(o) }));
  const groups = {
    Daily: items.filter((o) => o.group === 'Daily'),
    Weekly: items.filter((o) => o.group === 'Weekly'),
    Season: items.filter((o) => o.group === 'Season'),
  };
  res.json({ groups, count: items.length });
});

/**
 * GET /api/objectives/roadmap
 * Personalised "what to do today" plan: the best-order objective list plus a
 * coin/XP/time forecast — the spec's Roadmap Generator.
 */
router.get('/roadmap', (_req: Request, res: Response) => {
  const ranked = OBJECTIVES.filter((o) => o.progress < 1)
    .map((o) => ({ ...o, priority: priority(o) }))
    .sort((a, b) => b.priority - a.priority);

  const today = ranked.filter((o) => o.group === 'Daily' || o.priority > 20).slice(0, 5);
  const coinsToEarn = today.reduce((s, o) => s + o.rewardValue, 0);
  const xpToEarn = today.reduce((s, o) => s + o.xp, 0);
  const minutes = today.reduce((s, o) => s + Math.round(o.estMinutes * (1 - o.progress)), 0);

  res.json({
    generatedAt: new Date().toISOString(),
    tasks: today.map((o, i) => ({
      order: i + 1,
      id: o.id,
      name: o.name,
      group: o.group,
      reward: o.rewardName,
      rewardValue: o.rewardValue,
      estMinutes: Math.round(o.estMinutes * (1 - o.progress)),
      why: o.priority > 25 ? 'High coins-per-minute' : o.progress > 0 ? 'Almost complete' : 'Quick daily reward',
    })),
    forecast: { coinsToEarn, xpToEarn, estMinutes: minutes },
  });
});

export default router;
