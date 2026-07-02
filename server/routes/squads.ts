import { Router, Request, Response } from 'express';
import { SQUAD_TEMPLATES, type SquadTemplate } from '../lib/fcFixtures.js';
import { getScoredPool, estimateRatingPrice } from '../lib/cardPool.js';
import type { MarketIntelligence } from '../lib/marketIntelligence.js';

const router = Router();

/** Approximate squad rating from 11 slot ratings (average + FC bonus). */
function squadRating(ratings: number[]): number {
  const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
  const bonus = ratings.filter((r) => r > avg).reduce((s, r) => s + (r - avg), 0) / ratings.length;
  return Math.round(avg + bonus);
}

/** Fill each slot from the cheapest suitable card in the pool. */
function priceTemplate(pool: MarketIntelligence[], tpl: SquadTemplate) {
  const slots = tpl.slots.map((slot) => {
    const match = pool
      .filter((c) => c.rating >= slot.rating - 1 && c.rating <= slot.rating + 1)
      .filter((c) => !slot.position || slot.position === 'GK' ? c.position === slot.position : true)
      .sort((a, b) => a.price - b.price)[0];
    const price = match?.price ?? estimateRatingPrice(slot.rating);
    return {
      position: slot.position,
      archetype: slot.archetype,
      rating: match?.rating ?? slot.rating,
      name: match?.name ?? `${slot.rating} ${slot.position}`,
      price,
    };
  });
  const cost = slots.reduce((s, x) => s + x.price, 0);
  const rating = squadRating(slots.map((s) => s.rating));
  return { ...tpl, slots, estCost: cost, rating };
}

/** GET /api/squads?budget=Mid — meta squad templates priced from the market. */
router.get('/', async (req: Request, res: Response) => {
  try {
    const pool = await getScoredPool();
    const budget = req.query.budget as string | undefined;
    let templates = SQUAD_TEMPLATES;
    if (budget) templates = templates.filter((t) => t.budgetTier.toLowerCase() === budget.toLowerCase());
    res.json({ count: templates.length, items: templates.map((t) => priceTemplate(pool, t)) });
  } catch (error) {
    console.error('Squads error:', error);
    res.status(500).json({ error: 'Failed to load squads' });
  }
});

/** GET /api/squads/:id — a single template with full priced XI. */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tpl = SQUAD_TEMPLATES.find((t) => t.id === req.params.id);
    if (!tpl) return res.status(404).json({ error: 'Squad not found' });
    const pool = await getScoredPool();
    res.json(priceTemplate(pool, tpl));
  } catch (error) {
    console.error('Squad detail error:', error);
    res.status(500).json({ error: 'Failed to load squad' });
  }
});

export default router;
