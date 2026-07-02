/**
 * Shared scored card pool.
 * Loads a candidate pool of cards from the live players table (or mock data),
 * scores every card with the Market Intelligence engine, and caches the result
 * so the market, SBC, evolution, squad and dashboard features share one DB pass.
 */
import { playersDb } from './playersDb.js';
import { isMockMode, mockCards } from './mockData.js';
import { scoreCard, type MarketIntelligence, type RawCard } from './marketIntelligence.js';
import { getMovementMap, applyMovement, stableKey } from './priceHistory.js';

const CACHE_TTL = 5 * 60 * 1000;
let poolCache: { data: MarketIntelligence[]; timestamp: number } | null = null;

/** Load the raw candidate pool (current live prices), no scoring. */
export async function getRawPool(): Promise<RawCard[]> {
  if (isMockMode) return mockCards as RawCard[];
  try {
    return (await playersDb.card.findMany({
      where: { rating: { gte: 75 } },
      orderBy: [{ rating: 'desc' }],
      take: 400,
    })) as unknown as RawCard[];
  } catch (error) {
    console.error('Card pool query failed, using mock data:', error);
    return mockCards as RawCard[];
  }
}

export async function getScoredPool(): Promise<MarketIntelligence[]> {
  if (poolCache && Date.now() - poolCache.timestamp < CACHE_TTL) {
    return poolCache.data;
  }

  const raw = await getRawPool();

  // Enrich with real 24h/7d movement from the snapshot history, so the engine
  // scores on live deltas (dataQuality: 'live') rather than model estimates.
  const movement = await getMovementMap(raw.map((c) => stableKey(c)));
  const scored = raw
    .map((card) => scoreCard(applyMovement(card, movement.get(stableKey(card)))))
    .filter((m): m is MarketIntelligence => m !== null);

  poolCache = { data: scored, timestamp: Date.now() };
  return scored;
}

/** Cards within a rating band, cheapest first — the basis for SBC fodder. */
export function fodderInBand(
  pool: MarketIntelligence[],
  minRating: number,
  maxRating: number
): MarketIntelligence[] {
  return pool
    .filter((c) => c.rating >= minRating && c.rating <= maxRating)
    .sort((a, b) => a.price - b.price);
}

/** Rough coin cost of the cheapest N cards at a given rating (for SBC estimates). */
export function cheapestPrice(pool: MarketIntelligence[], rating: number): number {
  const band = pool.filter((c) => c.rating === rating).sort((a, b) => a.price - b.price);
  return band[0]?.price ?? estimateRatingPrice(rating);
}

/** Fallback price model for a rating when the pool has no exact match. */
export function estimateRatingPrice(rating: number): number {
  if (rating >= 92) return 300000;
  if (rating >= 90) return 120000;
  if (rating >= 88) return 45000;
  if (rating >= 86) return 18000;
  if (rating >= 84) return 6000;
  if (rating >= 82) return 2500;
  if (rating >= 80) return 1200;
  return 650;
}
