import { Router, Request, Response } from 'express';
import { getScoredPool } from '../lib/cardPool.js';
import { EVOLUTIONS, type Evolution } from '../lib/fcFixtures.js';
import type { MarketIntelligence } from '../lib/marketIntelligence.js';

const router = Router();

/** Candidate cards from the pool that satisfy an evolution's requirements. */
function candidates(pool: MarketIntelligence[], evo: Evolution): MarketIntelligence[] {
  const { maxRating, positions, maxPrice } = evo.requirements;
  return pool
    .filter((c) => (maxRating == null || c.rating <= maxRating))
    .filter((c) => (maxPrice == null || c.price <= maxPrice))
    .filter((c) => (!positions || (c.position != null && positions.includes(c.position.toUpperCase()))))
    .sort((a, b) => b.investmentRating - a.investmentRating)
    .slice(0, 8);
}

function summarize(pool: MarketIntelligence[], evo: Evolution) {
  const cands = candidates(pool, evo);
  const cheapest = [...cands].sort((a, b) => a.price - b.price)[0] ?? null;
  const isFree = evo.costCoins === 0 && evo.costPoints === 0;
  // Value = meta output vs. entry cost of the cheapest eligible card + evo cost.
  const entry = (cheapest?.price ?? 0) + evo.costCoins;
  const valueRating = Math.max(
    0,
    Math.min(100, Math.round(evo.metaScore - entry / 4000 + (isFree ? 12 : 0)))
  );
  return {
    ...evo,
    candidateCount: cands.length,
    cheapestEntry: cheapest ? { name: cheapest.name, rating: cheapest.rating, price: cheapest.price } : null,
    entryCost: entry,
    isFree,
    valueRating,
    recommended: valueRating >= 65,
  };
}

/** GET /api/evolutions — list evolutions with best candidates + value. */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pool = await getScoredPool();
    res.json({ count: EVOLUTIONS.length, items: EVOLUTIONS.map((e) => summarize(pool, e)) });
  } catch (error) {
    console.error('Evolutions list error:', error);
    res.status(500).json({ error: 'Failed to load evolutions' });
  }
});

/** GET /api/evolutions/:id — evolution detail with full candidate list. */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const evo = EVOLUTIONS.find((e) => e.id === req.params.id);
    if (!evo) return res.status(404).json({ error: 'Evolution not found' });
    const pool = await getScoredPool();
    res.json({ ...summarize(pool, evo), candidates: candidates(pool, evo) });
  } catch (error) {
    console.error('Evolution detail error:', error);
    res.status(500).json({ error: 'Failed to load evolution' });
  }
});

export default router;
