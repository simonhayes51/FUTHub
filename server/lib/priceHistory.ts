/**
 * Live price-history service.
 *
 * Periodically snapshots current player prices (from the live fut_players pool)
 * into the main DB, then serves real 24h / 7d movement and history charts back
 * to the Market Intelligence engine. This is what turns the AI signals from
 * "estimated" into "live" — using the platform's own data, with no third-party
 * dependency.
 */
import { prisma } from './db.js';
import { isMockMode } from './mockData.js';
import { getScoredPool } from './cardPool.js';
import type { MarketIntelligence, RawCard } from './marketIntelligence.js';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const RETENTION_DAYS = 30;

/** Stable identity for a card across snapshots. */
export function stableKey(card: { cardId?: number | string | null; name?: string | null; version?: string | null; cardType?: string | null }): string {
  if (card.cardId != null && String(card.cardId).length > 0) return `id:${card.cardId}`;
  return `nm:${(card.name ?? 'unknown').toLowerCase()}|${(card.version ?? card.cardType ?? 'gold').toLowerCase()}`;
}

/**
 * Capture a snapshot of every card's current price. Idempotent within the hour:
 * if a snapshot batch was written in the last 55 minutes it is skipped, so the
 * endpoint and the in-process scheduler can both call it safely.
 */
export async function captureSnapshots(force = false): Promise<{ captured: number; skipped: boolean }> {
  if (isMockMode) return { captured: 0, skipped: true };

  if (!force) {
    const recent = await prisma.priceSnapshot.count({
      where: { capturedAt: { gte: new Date(Date.now() - 55 * 60 * 1000) } },
    });
    if (recent > 0) return { captured: 0, skipped: true };
  }

  const pool = await getScoredPool();
  const rows = pool
    .filter((c) => c.price > 0)
    .map((c) => ({
      cardKey: stableKey(c),
      cardId: c.cardId ?? null,
      name: c.name,
      rating: c.rating,
      price: Math.round(c.price),
    }));

  if (rows.length === 0) return { captured: 0, skipped: true };

  await prisma.priceSnapshot.createMany({ data: rows });

  // Prune old history to keep the table bounded.
  await prisma.priceSnapshot.deleteMany({
    where: { capturedAt: { lt: new Date(Date.now() - RETENTION_DAYS * DAY) } },
  });

  return { captured: rows.length, skipped: false };
}

/**
 * For a set of card keys, return the most recent snapshot price that is at least
 * 24h / 7d old — a correct "price N ago" proxy for movement calculations.
 */
export async function getMovementMap(
  keys: string[]
): Promise<Map<string, { price24hAgo?: number; price7dAgo?: number }>> {
  const map = new Map<string, { price24hAgo?: number; price7dAgo?: number }>();
  if (isMockMode || keys.length === 0) return map;

  const cutoff24 = new Date(Date.now() - DAY);
  const cutoff7d = new Date(Date.now() - 7 * DAY);

  try {
    // DISTINCT ON gives the latest row per card at/older than each cutoff.
    const at24 = await prisma.$queryRaw<Array<{ cardKey: string; price: number }>>`
      SELECT DISTINCT ON ("cardKey") "cardKey", price
      FROM price_snapshots
      WHERE "capturedAt" <= ${cutoff24}
      ORDER BY "cardKey", "capturedAt" DESC
    `;
    const at7d = await prisma.$queryRaw<Array<{ cardKey: string; price: number }>>`
      SELECT DISTINCT ON ("cardKey") "cardKey", price
      FROM price_snapshots
      WHERE "capturedAt" <= ${cutoff7d}
      ORDER BY "cardKey", "capturedAt" DESC
    `;
    for (const r of at24) map.set(r.cardKey, { ...map.get(r.cardKey), price24hAgo: Number(r.price) });
    for (const r of at7d) map.set(r.cardKey, { ...map.get(r.cardKey), price7dAgo: Number(r.price) });
  } catch (error) {
    console.error('getMovementMap failed (history table may not exist yet):', error);
  }
  return map;
}

/** Merge real movement into raw cards so the engine scores on live deltas. */
export function applyMovement(raw: RawCard, movement?: { price24hAgo?: number; price7dAgo?: number }): RawCard {
  if (!movement) return raw;
  return {
    ...raw,
    price24hAgo: movement.price24hAgo ?? raw.price24hAgo,
    price7dAgo: movement.price7dAgo ?? raw.price7dAgo,
  };
}

/** Ordered price history for a single card (for charts). */
export async function getHistory(cardKey: string, sinceHours = 24 * 30) {
  if (isMockMode) return [];
  try {
    const rows = await prisma.priceSnapshot.findMany({
      where: { cardKey, capturedAt: { gte: new Date(Date.now() - sinceHours * HOUR) } },
      orderBy: { capturedAt: 'asc' },
      select: { price: true, capturedAt: true },
    });
    return rows.map((r) => ({ time: r.capturedAt.toISOString(), price: r.price }));
  } catch (error) {
    console.error('getHistory failed:', error);
    return [];
  }
}
