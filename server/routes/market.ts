import { Router, Request, Response } from 'express';
import { playersDb } from '../lib/playersDb.js';
import { isMockMode, mockCards } from '../lib/mockData.js';
import { getScoredPool } from '../lib/cardPool.js';
import { captureSnapshots, getHistory, stableKey } from '../lib/priceHistory.js';
import {
  scoreCard,
  rankForCategory,
  marketOverview,
  SCANNER_CATEGORIES,
  type MarketIntelligence,
  type ScannerCategory,
  type RawCard,
} from '../lib/marketIntelligence.js';

const router = Router();

const VALID_CATEGORIES = new Set(SCANNER_CATEGORIES.map((c) => c.id));

/**
 * POST /api/market/snapshot
 * Capture a price snapshot (for movement history + charts). Protected by the
 * SNAPSHOT_TOKEN header so an external cron can trigger it; the in-process
 * scheduler also calls the underlying function directly.
 */
router.post('/snapshot', async (req: Request, res: Response) => {
  const token = process.env.SNAPSHOT_TOKEN;
  if (token && req.get('x-snapshot-token') !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const result = await captureSnapshots(req.query.force === 'true');
    res.json({ ok: true, ...result });
  } catch (error) {
    console.error('Snapshot error:', error);
    res.status(500).json({ error: 'Failed to capture snapshot' });
  }
});

/** GET /api/market/history/:id — real price history for a card's charts. */
router.get('/history/:id', async (req: Request, res: Response) => {
  try {
    const pool = await getScoredPool();
    const card = pool.find((c) => c.id === req.params.id || String(c.cardId) === req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    const sinceHours = Math.min(24 * 90, Math.max(1, Number(req.query.hours) || 24 * 30));
    const history = await getHistory(stableKey(card), sinceHours);
    res.json({
      id: card.id,
      name: card.name,
      current: card.price,
      dataQuality: history.length > 0 ? 'live' : card.dataQuality,
      points: history.length,
      history,
    });
  } catch (error) {
    console.error('Market history error:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

/** GET /api/market/categories — list available scanner categories. */
router.get('/categories', (_req: Request, res: Response) => {
  res.json({ categories: SCANNER_CATEGORIES });
});

/**
 * GET /api/market/overview
 * Market-wide sentiment + a handful of top picks for the dashboard.
 */
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const pool = await getScoredPool();
    const overview = marketOverview(pool);
    const topPicks = rankForCategory(pool, 'best-investments').slice(0, 6);
    const risers = rankForCategory(pool, 'fastest-risers').slice(0, 5);
    const fallers = rankForCategory(pool, 'fastest-fallers').slice(0, 5);
    res.json({
      overview,
      topPicks,
      risers,
      fallers,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market overview error:', error);
    res.status(500).json({ error: 'Failed to build market overview' });
  }
});

/**
 * GET /api/market/scanner?category=best-investments&limit=20
 * Ranked list for a single scanner category.
 */
router.get('/scanner', async (req: Request, res: Response) => {
  try {
    const category = String(req.query.category || 'best-investments') as ScannerCategory;
    if (!VALID_CATEGORIES.has(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        validCategories: Array.from(VALID_CATEGORIES),
      });
    }
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const pool = await getScoredPool();
    const ranked = rankForCategory(pool, category).slice(0, limit);
    const meta = SCANNER_CATEGORIES.find((c) => c.id === category);

    res.json({
      category,
      label: meta?.label,
      description: meta?.description,
      count: ranked.length,
      items: ranked,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market scanner error:', error);
    res.status(500).json({ error: 'Failed to run market scanner' });
  }
});

/**
 * GET /api/market/intelligence/:id
 * Full AI investment intelligence for a single card.
 */
router.get('/intelligence/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMockMode) {
      const card = mockCards.find((c) => c.id === id || String(c.cardId) === id) || mockCards[0];
      const intelligence = scoreCard(card as RawCard);
      if (!intelligence) return res.status(404).json({ error: 'Card not found' });
      return res.json({ intelligence, alternatives: buildAlternatives(intelligence, mockCards as RawCard[]) });
    }

    let card: RawCard | null = null;
    try {
      card = (await playersDb.card.findFirst({
        where: {
          OR: [{ id }, ...(Number.isFinite(Number(id)) ? [{ cardId: Number(id) }] : [])],
        },
      })) as unknown as RawCard | null;
    } catch (error) {
      console.error('Intelligence card query failed:', error);
    }

    if (!card) return res.status(404).json({ error: 'Card not found' });

    const intelligence = scoreCard(card);
    if (!intelligence) return res.status(404).json({ error: 'Card not found' });

    // Alternatives: similarly-rated cards from the scored pool.
    const pool = await getScoredPool();
    const alternatives = buildAlternatives(intelligence, undefined, pool);

    res.json({ intelligence, alternatives });
  } catch (error) {
    console.error('Market intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch market intelligence' });
  }
});

/** Suggest alternative investments in a similar rating band. */
function buildAlternatives(
  target: MarketIntelligence,
  rawPool?: RawCard[],
  scoredPool?: MarketIntelligence[]
): MarketIntelligence[] {
  const pool =
    scoredPool ??
    (rawPool || [])
      .map((c) => scoreCard(c))
      .filter((m): m is MarketIntelligence => m !== null);

  return pool
    .filter((m) => m.id !== target.id && Math.abs(m.rating - target.rating) <= 2)
    .sort((a, b) => b.investmentRating - a.investmentRating)
    .slice(0, 4);
}

export default router;
