import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Simple in-memory cache for trending data
const trendingCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/trending/cards
 * Returns trending cards based on price changes over specified timeframe
 *
 * Query params:
 * - timeframe: "6h" | "12h" | "24h" (default: "24h")
 * - limit: number (default: 20)
 * - direction: "rising" | "falling" | "all" (default: "all")
 */
router.get('/cards', async (req: Request, res: Response) => {
  try {
    const {
      timeframe = '24h',
      limit = 20,
      direction = 'all'
    } = req.query;

    const cacheKey = `trending_${timeframe}_${limit}_${direction}`;
    const cached = trendingCache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    // Calculate time window
    const hours = timeframe === '6h' ? 6 : timeframe === '12h' ? 12 : 24;
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    // Get cards with recent price changes
    const cards = await prisma.$queryRaw`
      SELECT
        c.id,
        c.card_id as "cardId",
        c.name,
        c.rating,
        c.position,
        c.club,
        c.league,
        c.nation,
        c.card_type as "cardType",
        c.current_price as "currentPrice",
        c.price_24h_ago as "price24hAgo",
        c.price_7d_ago as "price7dAgo",
        c.platform,
        CASE
          WHEN c.price_24h_ago IS NOT NULL AND c.price_24h_ago > 0
          THEN ROUND(((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100)::numeric, 2)
          ELSE 0
        END as "priceChangePercent",
        CASE
          WHEN c.current_price > c.price_24h_ago THEN c.current_price - c.price_24h_ago
          ELSE c.price_24h_ago - c.current_price
        END as "priceChangeAmount"
      FROM "Card" c
      WHERE c.current_price IS NOT NULL
        AND c.price_24h_ago IS NOT NULL
        AND c.price_24h_ago > 0
        ${direction === 'rising' ? 'AND c.current_price > c.price_24h_ago' : ''}
        ${direction === 'falling' ? 'AND c.current_price < c.price_24h_ago' : ''}
      ORDER BY ABS(
        CASE
          WHEN c.price_24h_ago > 0
          THEN ((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100)
          ELSE 0
        END
      ) DESC
      LIMIT ${Number(limit)}
    `;

    const result = {
      timeframe,
      cards: cards,
      count: Array.isArray(cards) ? cards.length : 0,
      cachedAt: new Date().toISOString(),
    };

    // Cache the result
    trendingCache.set(cacheKey, { data: result, timestamp: Date.now() });

    res.json(result);
  } catch (error) {
    console.error('Error fetching trending cards:', error);
    res.status(500).json({ error: 'Failed to fetch trending cards' });
  }
});

/**
 * GET /api/trending/summary
 * Returns market summary with trending/falling/stable counts
 *
 * Query params:
 * - timeframe: "6h" | "12h" | "24h" (default: "24h")
 * - riseThreshold: number (default: 5) - % change to count as "trending"
 * - fallThreshold: number (default: 5) - % change to count as "falling"
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const {
      timeframe = '24h',
      riseThreshold = 5,
      fallThreshold = 5,
    } = req.query;

    const cacheKey = `summary_${timeframe}_${riseThreshold}_${fallThreshold}`;
    const cached = trendingCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    const rise = Number(riseThreshold);
    const fall = Number(fallThreshold);

    // Get market summary statistics
    const summary = await prisma.$queryRaw`
      SELECT
        COUNT(*) as total,
        COUNT(CASE
          WHEN c.price_24h_ago > 0
            AND ((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100) >= ${rise}
          THEN 1
        END) as trending,
        COUNT(CASE
          WHEN c.price_24h_ago > 0
            AND ((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100) <= ${-fall}
          THEN 1
        END) as falling,
        COUNT(CASE
          WHEN c.price_24h_ago > 0
            AND ABS((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100) < ${rise}
          THEN 1
        END) as stable
      FROM "Card" c
      WHERE c.current_price IS NOT NULL
        AND c.price_24h_ago IS NOT NULL
        AND c.price_24h_ago > 0
    ` as any[];

    const stats = summary[0] || { total: 0, trending: 0, falling: 0, stable: 0 };

    const result = {
      timeframe,
      total: Number(stats.total),
      trending: Number(stats.trending),
      falling: Number(stats.falling),
      stable: Number(stats.stable),
      thresholds: {
        rise: Number(riseThreshold),
        fall: Number(fallThreshold),
      },
      cachedAt: new Date().toISOString(),
    };

    trendingCache.set(cacheKey, { data: result, timestamp: Date.now() });

    res.json(result);
  } catch (error) {
    console.error('Error fetching market summary:', error);
    res.status(500).json({ error: 'Failed to fetch market summary' });
  }
});

/**
 * GET /api/trending/movers
 * Returns biggest movers (gainers and losers)
 *
 * Query params:
 * - limit: number (default: 10)
 */
router.get('/movers', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const cacheKey = `movers_${limit}`;
    const cached = trendingCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    // Get biggest gainers
    const gainers = await prisma.$queryRaw`
      SELECT
        c.id,
        c.card_id as "cardId",
        c.name,
        c.rating,
        c.position,
        c.club,
        c.league,
        c.current_price as "currentPrice",
        c.price_24h_ago as "price24hAgo",
        ROUND(((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100)::numeric, 2) as "priceChangePercent"
      FROM "Card" c
      WHERE c.current_price IS NOT NULL
        AND c.price_24h_ago IS NOT NULL
        AND c.price_24h_ago > 0
        AND c.current_price > c.price_24h_ago
      ORDER BY ((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric) DESC
      LIMIT ${Number(limit)}
    `;

    // Get biggest losers
    const losers = await prisma.$queryRaw`
      SELECT
        c.id,
        c.card_id as "cardId",
        c.name,
        c.rating,
        c.position,
        c.club,
        c.league,
        c.current_price as "currentPrice",
        c.price_24h_ago as "price24hAgo",
        ROUND(((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric * 100)::numeric, 2) as "priceChangePercent"
      FROM "Card" c
      WHERE c.current_price IS NOT NULL
        AND c.price_24h_ago IS NOT NULL
        AND c.price_24h_ago > 0
        AND c.current_price < c.price_24h_ago
      ORDER BY ((c.current_price::numeric - c.price_24h_ago::numeric) / c.price_24h_ago::numeric) ASC
      LIMIT ${Number(limit)}
    `;

    const result = {
      gainers,
      losers,
      cachedAt: new Date().toISOString(),
    };

    trendingCache.set(cacheKey, { data: result, timestamp: Date.now() });

    res.json(result);
  } catch (error) {
    console.error('Error fetching movers:', error);
    res.status(500).json({ error: 'Failed to fetch movers' });
  }
});

export default router;
