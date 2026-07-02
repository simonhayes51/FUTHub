# FC Edge — Platform Features

FC Edge turns the raw player/price data into a decision engine: _what to buy,
what to sell, which SBC to do, how to make coins_. Every feature is built on one
shared, deterministic scoring engine and a cached card pool, works in mock mode,
and follows the FC26 glassmorphism / cyan-purple design language.

## Feature surfaces (routes)

| Route | Feature | What it does |
|-------|---------|--------------|
| `/dashboard` | **Command Centre** | Personal-assistant daily briefing, market heat, top AI picks, latest SBCs, priority objectives, news — one call (`/api/dashboard`). |
| `/market` | **Market Intelligence + Scanner** | AI Buy/Sell/Hold scores, ROI, risk, suggested prices per card; 10 scanner categories; full intelligence dialog. |
| `/sbc` | **SBC Centre** | Every SBC solved by AI for the cheapest squad (priced from the live market), value rating, difficulty, should-I-complete verdict. |
| `/packs` | **Pack Centre** | Pack odds, expected value vs coin price, and a reproducible (seeded) pack simulator. |
| `/evolutions` | **Evolution Centre** | Each Evolution with its best eligible players from the market and a value rating. |
| `/objectives` | **Objectives & Roadmap** | Objectives ranked by reward-per-minute + an auto-generated roadmap with coin/XP/time forecast. |
| `/squads` | **Squad Builder** | Meta squad templates priced live, with formation, chemistry, rating and playstyle. |
| `/coach` | **AI Coach** | Chat that answers buy/sell/SBC/coins/objectives questions using live market data. |
| `/news` | **News Centre** | Promos, leaks, SBCs, objectives and market news with an impact flag. |

## Architecture

```
server/lib/marketIntelligence.ts   deterministic scoring engine (Buy/Sell/Hold, ROI, risk, reasons)
server/lib/cardPool.ts             shared cached scored pool (one DB pass for all features)
server/lib/fcFixtures.ts           sample SBC/pack/evolution/objective/squad/news datasets
server/lib/rng.ts / format.ts      seeded RNG + coin formatting
server/routes/{market,sbc,packs,evolutions,objectives,squads,coach,news,dashboard}.ts

src/lib/{marketTypes,fcTypes,marketFormat}.ts   shared types + formatters
src/hooks/{useMarketIntelligence,useFcEdge}.ts  react-query hooks
src/components/{market,fc}/*                     reusable UI (gauge, cards, page shell, primitives)
src/pages/*Page.tsx                             the nine feature screens
```

## Live market data

Signals run on **real price movement**, sourced from the platform's own data — no
third-party dependency (per spec).

- **Current prices** come live from the `fut_players` table (the existing FUT
  Traders Hub pipeline).
- **History** is built by a snapshot service (`server/lib/priceHistory.ts`): an
  hourly in-process scheduler (and a token-protected `POST /api/market/snapshot`
  for external cron) records every card's price into a `PriceSnapshot` table
  (main DB, auto-created by `prisma db push`, pruned to 30 days).
- The card pool merges the latest snapshot at/older than 24h and 7d into each
  card before scoring, so movement, momentum and volatility are **real**. Each
  card reports `dataQuality: 'live' | 'estimated'`; the UI shows a LIVE/EST badge
  and a real price-history chart (`GET /api/market/history/:id`).
- Until 24h of snapshots accrue for a card, it scores from durable attributes and
  is clearly flagged `estimated`; it flips to `live` automatically once history
  exists. No back-fill of fake history.

Config: `ENABLE_PRICE_SNAPSHOTS` (default on), `SNAPSHOT_TOKEN`,
`PLAYERS_DATABASE_URL`.

## Design principles

- **Deterministic** — same input → same output. Stable UI, cacheable, explainable.
- **Honest** — where live movement data is unavailable, figures are flagged as
  model estimates; sample datasets are labelled as such. Nothing is presented as
  real EA data that isn't.
- **Swap-ready** — fixtures and the scoring function are isolated so a live EA
  ingestion pipeline or a trained model/LLM can replace them without touching the
  API or UI.

## Out of scope in this environment

Native iOS/Android binaries, Stripe billing, Firebase/APNs push and OAuth
provider setup require external accounts, credentials and app signing that aren't
available here. The product/API surface for all of them is in place; wiring is a
configuration/credentials step. Price data is now **live** (see above); the SBC /
pack / evolution / news *definitions* remain sample datasets until an EA content
feed is ingested — but their pricing and solving already run on the live market.

## Verified

- `npx tsc -p tsconfig.app.json` — new files clean (pre-existing errors in
  `UserDashboard.tsx` / `WatchlistPage.tsx` are unrelated).
- `npx vite build` — production build succeeds.
- Engine smoke test — deterministic, all scores within 0–100, sensible rankings.

_All numbers are model estimates to aid decisions — not financial advice, and
not affiliated with EA Sports._
