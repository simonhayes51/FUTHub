import { Router, Request, Response } from 'express';
import { getScoredPool } from '../lib/cardPool.js';
import { rankForCategory, marketOverview, type MarketIntelligence } from '../lib/marketIntelligence.js';
import { SBCS, OBJECTIVES } from '../lib/fcFixtures.js';
import { formatCoinsServer } from '../lib/format.js';

const router = Router();

type Intent = 'invest' | 'sell' | 'sbc' | 'coins' | 'objectives' | 'overview';

function classify(message: string): Intent {
  const m = message.toLowerCase();
  if (/(sbc|challenge|fodder to build|squad building)/.test(m)) return 'sbc';
  if (/(sell|dump|offload|get rid)/.test(m)) return 'sell';
  if (/(make|earn|profit|coins|500k|100k|1m|million|grind)/.test(m)) return 'coins';
  if (/(objective|roadmap|what to do|today|task|xp)/.test(m)) return 'objectives';
  if (/(buy|invest|snipe|undervalued|rise|opportunit|what should i)/.test(m)) return 'invest';
  return 'overview';
}

function pickCard(list: MarketIntelligence[], n: number) {
  return list.slice(0, n).map((c) => ({
    id: c.id,
    name: c.name,
    rating: c.rating,
    price: c.price,
    recommendation: c.recommendation,
    investmentRating: c.investmentRating,
    expectedRoi: c.expectedRoi,
  }));
}

/** POST /api/coach { message } — the FC Edge AI Coach. */
router.post('/', async (req: Request, res: Response) => {
  try {
    const message = String(req.body?.message ?? '').trim();
    if (!message) return res.status(400).json({ error: 'message is required' });

    const pool = await getScoredPool();
    const intent = classify(message);
    let answer = '';
    let data: any = null;

    switch (intent) {
      case 'invest': {
        const picks = rankForCategory(pool, 'best-investments').filter((c) => c.recommendation.includes('BUY'));
        const top = picks[0];
        answer = top
          ? `Right now my top pick is **${top.name}** (${top.rating}) at ${formatCoinsServer(top.price)} — AI rating ${top.investmentRating}/100 with a projected ${top.expectedRoi}% ROI. I've listed more below, sorted by conviction. Buy near the suggested price and set a sell alert.`
          : `The market looks flat — no high-conviction buys right now. Hold coins and wait for a dip.`;
        data = { cards: pickCard(picks, 6) };
        break;
      }
      case 'sell': {
        const sells = rankForCategory(pool, 'most-overpriced');
        const top = sells[0];
        answer = top
          ? `If you're holding **${top.name}** (${top.rating}), consider selling — it's scoring a sell signal (${top.sellScore}/100) and looks above fair value. These are the cards I'd list first.`
          : `Nothing is screaming "sell" right now. Hold your investments a bit longer.`;
        data = { cards: pickCard(sells, 6) };
        break;
      }
      case 'sbc': {
        const ranked = [...SBCS].sort((a, b) => b.reward.estValue - a.reward.estValue);
        const repeatable = ranked.find((s) => s.repeatable);
        answer = `For value, prioritise repeatable upgrades like **${repeatable?.name ?? '85+ x10'}** when fodder is cheap. The highest-reward SBC live is **${ranked[0].name}** (reward ≈ ${formatCoinsServer(ranked[0].reward.estValue)}). Open the SBC Centre for the AI-solved cheapest squad on each.`;
        data = {
          sbcs: ranked.slice(0, 5).map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            rewardValue: s.reward.estValue,
            repeatable: s.repeatable,
            expiresInDays: s.expiresInDays,
          })),
        };
        break;
      }
      case 'coins': {
        const kMatch = message.match(/(\d+)\s*k/i);
        const target = kMatch
          ? Number(kMatch[1]) * 1000
          : /million|1m/i.test(message)
          ? 1_000_000
          : 100_000;
        const risers = rankForCategory(pool, 'highest-roi');
        answer = [
          `Here's a plan to make ${formatCoinsServer(target)}:`,
          `1. **Flip premium fodder** — buy 84-88 golds on off-peak dips, relist into SBC demand (~10-15% per flip).`,
          `2. **Snipe the risers** — the cards below have the best projected ROI right now.`,
          `3. **Grind repeatable SBCs** — cheap upgrades like 84+ x5 print small, steady profit when fodder is low.`,
          `4. **Do the daily objectives** — free packs and coins with almost no risk.`,
          `Reinvest profits and compound — most players hit ${formatCoinsServer(target)} far faster by flipping than by playing.`,
        ].join('\n');
        data = { targetCoins: target, cards: pickCard(risers, 6) };
        break;
      }
      case 'objectives': {
        const ranked = [...OBJECTIVES]
          .filter((o) => o.progress < 1)
          .sort((a, b) => b.rewardValue / b.estMinutes - a.rewardValue / a.estMinutes);
        answer = `Do these first for the best reward-per-minute: ${ranked.slice(0, 3).map((o) => `**${o.name}**`).join(', ')}. Check the Roadmap for the full ordered plan and a coin/XP forecast.`;
        data = { objectives: ranked.slice(0, 5) };
        break;
      }
      default: {
        const ov = marketOverview(pool);
        answer = `The market is **${ov.sentiment.toLowerCase()}** — ${ov.rising} cards rising vs ${ov.falling} falling, heat index ${ov.heatIndex}/100. Ask me what to buy, what to sell, which SBC is worth doing, or how to make coins.`;
        data = { overview: ov, cards: pickCard(rankForCategory(pool, 'best-investments'), 4) };
        break;
      }
    }

    res.json({ intent, answer, data, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Coach error:', error);
    res.status(500).json({ error: 'Coach failed to respond' });
  }
});

export default router;
