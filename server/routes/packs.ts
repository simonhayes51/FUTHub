import { Router, Request, Response } from 'express';
import { PACKS, type Pack, type PackTier } from '../lib/fcFixtures.js';
import { estimateRatingPrice } from '../lib/cardPool.js';
import { seededRng } from '../lib/rng.js';

const router = Router();

/** Modelled average coin value of one rare item that lands in a tier. */
function tierValue(tier: PackTier): number {
  // Average of the value at the tier's floor and ceiling rating.
  return (estimateRatingPrice(tier.min) + estimateRatingPrice(tier.max)) / 2;
}

/** Expected value of a pack = sum over rare slots of expected item value. */
function expectedValue(pack: Pack): number {
  const perSlot = pack.tiers.reduce((sum, t) => sum + t.probability * tierValue(t), 0);
  return Math.round(perSlot * pack.rareCount);
}

function summarize(pack: Pack) {
  const ev = expectedValue(pack);
  const cost = pack.priceCoins ?? 0;
  const evVsCoins = cost > 0 ? Math.round(((ev - cost) / cost) * 100) : null;
  // Chance of at least one 88+ across all rare slots.
  const p88 = pack.tiers.filter((t) => t.min >= 88).reduce((s, t) => s + t.probability, 0);
  const chanceOf88 = 1 - Math.pow(1 - p88, pack.rareCount);
  let verdict: string;
  if (evVsCoins == null) verdict = 'Points-only or SBC pack — value depends on your fodder.';
  else if (evVsCoins > 5) verdict = 'Positive expected value at the coin price — worth it.';
  else if (evVsCoins > -20) verdict = 'Roughly break-even — a gamble, not an investment.';
  else verdict = 'Negative expected value — the market is cheaper than opening.';
  return {
    ...pack,
    expectedValue: ev,
    evVsCoinsPercent: evVsCoins,
    chanceOf88: Math.round(chanceOf88 * 1000) / 10,
    verdict,
  };
}

/** GET /api/packs — pack database with odds + expected value. */
router.get('/', (_req: Request, res: Response) => {
  res.json({ count: PACKS.length, items: PACKS.map(summarize) });
});

/** GET /api/packs/:id — single pack detail. */
router.get('/:id', (req: Request, res: Response) => {
  const pack = PACKS.find((p) => p.id === req.params.id);
  if (!pack) return res.status(404).json({ error: 'Pack not found' });
  res.json(summarize(pack));
});

/**
 * POST /api/packs/:id/simulate  { count?: number, seed?: string }
 * Deterministic pack simulator — same seed always yields the same pulls, so a
 * "Pack Simulator" UI is reproducible and shareable.
 */
router.post('/:id/simulate', (req: Request, res: Response) => {
  const pack = PACKS.find((p) => p.id === req.params.id);
  if (!pack) return res.status(404).json({ error: 'Pack not found' });

  const count = Math.min(50, Math.max(1, Number(req.body?.count) || 1));
  const seed = String(req.body?.seed ?? Date.now());
  const rng = seededRng(`${pack.id}:${seed}`);

  const opens = [] as Array<{
    rating: number;
    tier: string;
    value: number;
    isWalkout: boolean;
  }>[];
  let totalValue = 0;
  let bestPull = 0;

  for (let o = 0; o < count; o++) {
    const items = [] as { rating: number; tier: string; value: number; isWalkout: boolean }[];
    for (let s = 0; s < pack.rareCount; s++) {
      const roll = rng();
      let acc = 0;
      let chosen = pack.tiers[pack.tiers.length - 1];
      for (const tier of pack.tiers) {
        acc += tier.probability;
        if (roll <= acc) {
          chosen = tier;
          break;
        }
      }
      const rating = chosen.min + Math.floor(rng() * (chosen.max - chosen.min + 1));
      const value = estimateRatingPrice(rating);
      totalValue += value;
      bestPull = Math.max(bestPull, rating);
      items.push({ rating, tier: chosen.label, value, isWalkout: rating >= 86 });
    }
    items.sort((a, b) => b.rating - a.rating);
    opens.push(items);
  }

  const cost = (pack.priceCoins ?? 0) * count;
  res.json({
    packId: pack.id,
    packName: pack.name,
    count,
    seed,
    opens,
    totalValue,
    cost,
    netProfit: pack.priceCoins != null ? totalValue - cost : null,
    bestPull,
    expectedValue: expectedValue(pack) * count,
  });
});

export default router;
