import { Router, Request, Response } from 'express';
import { getScoredPool } from '../lib/cardPool.js';
import { rankForCategory, marketOverview } from '../lib/marketIntelligence.js';
import { SBCS, OBJECTIVES, NEWS } from '../lib/fcFixtures.js';
import { formatCoinsServer } from '../lib/format.js';

const router = Router();

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * GET /api/dashboard
 * The FC Edge core dashboard payload + a Personal Assistant digest — pulls the
 * market, SBCs, objectives and news into one call.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const name = (req.query.name as string) || 'Manager';
    const pool = await getScoredPool();
    const overview = marketOverview(pool);
    const topPicks = rankForCategory(pool, 'best-investments').slice(0, 5);
    const risers = rankForCategory(pool, 'fastest-risers').slice(0, 3);
    const fallers = rankForCategory(pool, 'fastest-fallers').slice(0, 3);

    const bestSbc = [...SBCS].sort((a, b) => b.reward.estValue - a.reward.estValue)[0];
    const roadmap = [...OBJECTIVES]
      .filter((o) => o.progress < 1)
      .sort((a, b) => b.rewardValue / b.estMinutes - a.rewardValue / a.estMinutes)
      .slice(0, 3);

    // Personal assistant one-liners.
    const assistant: string[] = [];
    assistant.push(
      `The market is ${overview.sentiment.toLowerCase()} — ${overview.rising} rising, ${overview.falling} falling.`
    );
    if (risers[0]) assistant.push(`${risers[0].name} is up ${risers[0].priceChange24h}% today.`);
    if (fallers[0]) assistant.push(`${fallers[0].name} dropped ${Math.abs(fallers[0].priceChange24h)}% — watch for a floor.`);
    if (topPicks[0]) assistant.push(`Top buy: ${topPicks[0].name} (AI ${topPicks[0].investmentRating}/100).`);
    if (bestSbc) assistant.push(`Consider the ${bestSbc.name} SBC — reward ≈ ${formatCoinsServer(bestSbc.reward.estValue)}.`);
    if (roadmap[0]) assistant.push(`Quick win: ${roadmap[0].name} for ${formatCoinsServer(roadmap[0].rewardValue)}.`);

    res.json({
      greeting: `${greeting()}, ${name}`,
      assistant,
      overview,
      topPicks,
      risers,
      fallers,
      sbcs: SBCS.slice(0, 4).map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        rewardValue: s.reward.estValue,
        expiresInDays: s.expiresInDays,
        repeatable: s.repeatable,
      })),
      objectives: roadmap,
      news: NEWS.slice(0, 4),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to build dashboard' });
  }
});

export default router;
