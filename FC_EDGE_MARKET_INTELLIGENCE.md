# FC Edge — AI Market Intelligence

This is the first vertical slice of the **FC Edge** vision: the flagship
_"What should I buy / sell / hold?"_ layer that sits on top of the existing
player/price data. It turns raw cards into an actionable investment view and
ships an end-to-end feature — engine → API → UI — rather than a mock.

> The full FC Edge spec (dashboard, SBC solver, squad builder, evolutions,
> community, native apps, Stripe, etc.) is a multi-quarter roadmap. This PR
> delivers the **Market Intelligence + Market Scanner** core that the rest of
> the product is designed to orbit, in a way that's cleanly extensible.

## What's included

### 1. Scoring engine — `server/lib/marketIntelligence.ts`
A pure, deterministic module that scores any card. Deterministic means the same
card always yields the same result (stable UI, cacheable, explainable) — no
random noise. It is shape-agnostic: it normalises both the live `fut_players`
row shape (`priceNum` / `price` / `version`) and the richer analytics/mock
shape (`currentPrice` / `price24hAgo` / `priceHistory`).

For each card it produces:
- **Buy / Sell / Hold scores** (0–100) and an overall **Investment Rating**
- **Recommendation** (STRONG BUY → AVOID), **Risk**, **Time Horizon**, **Confidence**
- **Expected ROI** (net of 5% EA tax), **Expected Movement**, **Suggested Buy/Sell**, **Expected Peak**
- Modelled **Lowest/Highest BIN**, **Supply**, **Demand**, **Volatility**, **Liquidity**
- Human-readable **reasons** ("Premium SBC fodder", "Trading below fair value", …)

Signals are heuristic (rating band / SBC-fodder demand, meta position, hot
leagues & nations, liquidity by price band, momentum). When live movement data
is unavailable it falls back to a stable model estimate derived only from
durable card attributes and flags `dataQuality: 'estimated'` — it never invents
a fake precise price history. The engine is structured so a trained model or LLM
can later replace `scoreCard()` without touching the API or UI.

### 2. API — `server/routes/market.ts` (`/api/market`)
- `GET /market/overview` — market heat index, sentiment, top picks, movers (dashboard)
- `GET /market/scanner?category=&limit=` — ranked list for any scanner category
- `GET /market/categories` — available scanner categories
- `GET /market/intelligence/:id` — full intelligence for one card + alternatives

A single scored candidate pool is cached (5 min) and reused across endpoints.
Everything works in `MOCK_DATA` mode, and DB errors fall back to mock data.

Scanner categories: Best Investments, Highest ROI, Fastest Risers/Fallers,
Most Undervalued/Overpriced, Best Fodder, Likely To Rise/Crash, Lowest Risk.

### 3. Frontend — route `/market`
- `src/pages/MarketIntelligencePage.tsx` — dashboard: heat index gauge, rising/
  stable/falling tiles, Today's Top AI Picks, movers, and the Market Scanner
  with category chips.
- `src/components/market/AiRatingGauge.tsx` — colour-ramped circular score gauge.
- `src/components/market/PlayerIntelCard.tsx` — compact glassmorphic card.
- `src/components/market/IntelligenceDetail.tsx` — full breakdown dialog (scores,
  metrics, microstructure meters, AI reasons, alternative investments).
- Hooks in `src/hooks/useMarketIntelligence.ts`; API methods in `src/lib/api.ts`;
  shared types in `src/lib/marketTypes.ts`; formatting in `src/lib/marketFormat.ts`.

Design follows the existing FC26 language: dark, glassmorphism, cyan→purple
gradients, neon glow, Framer Motion. A "Market" link was added to the navbar.

## How it maps to the spec
Covers the spec's **AI Market Intelligence**, **Market Scanner**, per-player
**Investment Rating / Buy-Sell-Hold / Confidence / ROI / Risk / Suggested
prices**, and the dashboard's **Market Heat Map / Trending / AI Recommendations**.

## Verified
- `npx tsc -p tsconfig.app.json` — new files clean (only 4 unrelated,
  pre-existing errors remain in `UserDashboard.tsx` / `WatchlistPage.tsx`).
- `npx vite build` — production build succeeds.

## Not financial advice
All numbers are model estimates to help decision-making, surfaced as such in the UI.
