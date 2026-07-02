import { Router, Request, Response } from 'express';
import { getScoredPool, estimateRatingPrice } from '../lib/cardPool.js';
import { SBCS, type Sbc, type SbcRequirement } from '../lib/fcFixtures.js';
import type { MarketIntelligence } from '../lib/marketIntelligence.js';

const router = Router();

interface SolvedSlot {
  rating: number;
  price: number;
  name: string;
}

interface SegmentSolution {
  label: string;
  players: number;
  targetRating: number;
  achievedRating: number;
  cost: number;
  slots: SolvedSlot[];
}

/** Cheapest card at exactly-or-above a rating, from the scored pool. */
function cheapestAtOrAbove(pool: MarketIntelligence[], rating: number): SolvedSlot {
  const candidates = pool.filter((c) => c.rating >= rating).sort((a, b) => a.price - b.price);
  const c = candidates[0];
  if (c) return { rating: c.rating, price: c.price, name: c.name };
  return { rating, price: estimateRatingPrice(rating), name: `${rating}-rated filler` };
}

function cheapestOverall(pool: MarketIntelligence[]): SolvedSlot {
  const c = [...pool].sort((a, b) => a.price - b.price)[0];
  if (c) return { rating: c.rating, price: c.price, name: c.name };
  return { rating: 75, price: estimateRatingPrice(75), name: '75-rated filler' };
}

/**
 * Greedy cheapest-squad solver.
 * FUT squad rating ≈ average of 11 ratings (we target average ≥ requirement,
 * which is conservative/safe). We fill N slots with a mix of the cheapest base
 * card and the cheapest "premium" card needed to pull the average up, then pick
 * the premium tier that minimises total cost.
 */
function solveSegment(pool: MarketIntelligence[], req: SbcRequirement): SegmentSolution {
  const N = req.players;
  const target = req.minSquadRating ?? 80;
  const base = cheapestOverall(pool);

  let best: { cost: number; slots: SolvedSlot[]; avg: number } | null = null;

  for (let premRating = target; premRating <= 93; premRating++) {
    const prem = cheapestAtOrAbove(pool, premRating);
    // Need k premium + (N-k) base so average >= target.
    // k*prem.rating + (N-k)*base.rating >= target*N
    const denom = prem.rating - base.rating;
    let k: number;
    if (base.rating >= target) k = 0;
    else if (denom <= 0) continue;
    else k = Math.ceil((target * N - base.rating * N) / denom);
    k = Math.max(0, Math.min(N, k));

    const slots: SolvedSlot[] = [
      ...Array.from({ length: k }, () => prem),
      ...Array.from({ length: N - k }, () => base),
    ];
    const cost = slots.reduce((s, x) => s + x.price, 0);
    const avg = slots.reduce((s, x) => s + x.rating, 0) / N;
    if (avg + 0.001 >= target && (!best || cost < best.cost)) {
      best = { cost, slots, avg };
    }
  }

  const chosen = best ?? {
    cost: base.price * N,
    slots: Array.from({ length: N }, () => base),
    avg: base.rating,
  };

  return {
    label: req.label,
    players: N,
    targetRating: target,
    achievedRating: Math.round(chosen.avg * 10) / 10,
    cost: chosen.cost,
    slots: chosen.slots,
  };
}

function solveSbc(pool: MarketIntelligence[], sbc: Sbc) {
  const segments = sbc.requirements.map((r) => solveSegment(pool, r));
  const totalCost = segments.reduce((s, seg) => s + seg.cost, 0);
  const profit = sbc.reward.estValue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  // Value rating (0-100): reward efficiency + a bonus for tradeable rewards.
  const valueRating = Math.max(
    0,
    Math.min(100, Math.round(50 + roi * 0.35 + (sbc.reward.tradeable ? 8 : 0)))
  );
  const difficulty = Math.min(
    100,
    Math.round(
      sbc.requirements.reduce((s, r) => s + (r.minSquadRating ?? 80) - 78 + (r.minSpecials ?? 0) * 3, 0)
    )
  );
  const shouldComplete = roi > 0 || (sbc.reward.type === 'player' && valueRating >= 55);

  let verdict: string;
  if (roi > 25) verdict = 'Great value — complete it.';
  else if (roi > 0) verdict = 'Slightly profitable — worth doing.';
  else if (sbc.reward.type === 'player') verdict = 'A coin loss, but the player may be worth it for your club.';
  else verdict = 'Overpriced right now — skip unless you need the fodder.';

  return {
    ...sbc,
    solution: { segments, totalCost },
    estimatedCost: totalCost,
    expectedReturn: sbc.reward.estValue,
    profit,
    roi: Math.round(roi * 10) / 10,
    valueRating,
    difficulty,
    shouldComplete,
    verdict,
  };
}

/** GET /api/sbc — list all SBCs with cost + value summary. */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pool = await getScoredPool();
    const items = SBCS.map((sbc) => {
      const solved = solveSbc(pool, sbc);
      // Trim heavy slot arrays from the list view.
      const { solution, ...rest } = solved;
      return { ...rest, segments: solution.segments.map((s) => ({ label: s.label, players: s.players, targetRating: s.targetRating, cost: s.cost })) };
    });
    res.json({ count: items.length, items });
  } catch (error) {
    console.error('SBC list error:', error);
    res.status(500).json({ error: 'Failed to load SBCs' });
  }
});

/** GET /api/sbc/:id — full SBC with AI-solved cheapest squad. */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const sbc = SBCS.find((s) => s.id === req.params.id);
    if (!sbc) return res.status(404).json({ error: 'SBC not found' });
    const pool = await getScoredPool();
    res.json(solveSbc(pool, sbc));
  } catch (error) {
    console.error('SBC detail error:', error);
    res.status(500).json({ error: 'Failed to solve SBC' });
  }
});

export default router;
