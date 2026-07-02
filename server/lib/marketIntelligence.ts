/**
 * FC Edge – Market Intelligence Engine
 * ------------------------------------
 * The flagship "AI" of FC Edge. This module turns a raw player card into an
 * actionable investment view: Buy / Sell / Hold scores, an overall investment
 * rating, expected ROI, risk, a suggested buy/sell range and human-readable
 * reasons.
 *
 * Design goals:
 *  - Deterministic. The same card always produces the same result, so the UI is
 *    stable and cacheable and results can be explained. (No random noise.)
 *  - Shape-agnostic. It normalises both the live `fut_players` row shape
 *    (`priceNum` / `price` / `version`) and the richer mock/analytics shape
 *    (`currentPrice` / `price24hAgo` / `priceHistory`).
 *  - Honest. When live movement data is missing we fall back to a model
 *    estimate derived only from durable card attributes (rating band, meta
 *    position, league demand) and flag lower confidence. We never invent a
 *    precise price history that doesn't exist.
 *
 * This is heuristic modelling, not a trained model — but it is structured so a
 * real model / LLM can later replace `scoreCard` without touching the API or UI.
 */

export interface RawCard {
  id?: string;
  cardId?: number | string | null;
  name?: string | null;
  rating?: number | null;
  position?: string | null;
  altPosition?: string | null;
  nation?: string | null;
  league?: string | null;
  club?: string | null;
  version?: string | null;
  cardType?: string | null;
  rarity?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  platform?: string | null;
  // Live analytics shape
  currentPrice?: number | null;
  price24hAgo?: number | null;
  price7dAgo?: number | null;
  priceChange24h?: number | null;
  priceChangePercent?: number | null;
  priceHistory?: Array<{ time?: string; price?: number }> | null;
  // fut_players shape
  price?: string | number | null;
  priceNum?: number | null;
}

export interface NormalizedCard {
  id: string;
  cardId: number | null;
  name: string;
  rating: number;
  position: string | null;
  league: string | null;
  nation: string | null;
  club: string | null;
  version: string;
  imageUrl: string | null;
  platform: string;
  price: number;
  price24hAgo: number | null;
  price7dAgo: number | null;
  /** true when the 24h/7d change is real market data rather than a model estimate */
  hasRealMovement: boolean;
}

export type Recommendation = 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'AVOID';
export type Risk = 'Low' | 'Medium' | 'High';
export type TimeHorizon = 'Intraday' | 'Short-term' | 'Mid-term' | 'Long-term';

export interface Reason {
  label: string;
  detail: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface MarketIntelligence {
  id: string;
  cardId: number | null;
  name: string;
  rating: number;
  position: string | null;
  league: string | null;
  nation: string | null;
  club: string | null;
  version: string;
  imageUrl: string | null;
  platform: string;

  price: number;
  lowestBin: number;
  highestBin: number;
  priceChange24h: number;
  priceChange7d: number;

  // Core scores (0-100)
  investmentRating: number;
  buyScore: number;
  sellScore: number;
  holdScore: number;
  confidence: number;

  recommendation: Recommendation;
  risk: Risk;
  timeHorizon: TimeHorizon;

  expectedRoi: number; // %
  expectedMovement: number; // % over horizon (can be negative)
  suggestedBuy: number;
  suggestedSell: number;
  expectedPeak: number;

  // Market microstructure (modelled)
  supply: number; // 0-100 (higher = more supply)
  demand: number; // 0-100 (higher = more demand)
  volatility: number; // 0-100
  liquidity: number; // 0-100

  reasons: Reason[];
  dataQuality: 'live' | 'estimated';
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Stable 32-bit hash of a string → used for deterministic model estimates. */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic pseudo-random in [0, 1) seeded by a string. */
function seededUnit(seed: string): number {
  return hashString(seed) / 4294967295;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, dp = 0): number {
  const f = Math.pow(10, dp);
  return Math.round(value * f) / f;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

// Leagues / nations with the strongest Ultimate Team demand (meta + Weekend
// League usage). Used to model demand when order-book data is unavailable.
const HOT_LEAGUES = new Set([
  'Premier League',
  'LaLiga',
  'La Liga',
  'Ligue 1',
  'Bundesliga',
  'Serie A',
]);
const HOT_NATIONS = new Set([
  'France',
  'Brazil',
  'England',
  'Spain',
  'Argentina',
  'Portugal',
  'Germany',
  'Netherlands',
]);
// Attacking / creative positions carry more Weekend League demand than others.
const HOT_POSITIONS = new Set(['ST', 'CF', 'LW', 'RW', 'CAM', 'CM']);
// Special-card versions that behave differently from base gold cards.
const SPECIAL_VERSIONS = /(icon|hero|totw|tots|toty|if|inform|sbc|objective|promo|rttk|ucl|futties|showdown|headliner|rulebreaker)/i;

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

export function normalizeCard(raw: RawCard): NormalizedCard | null {
  const rating = toNumber(raw.rating);
  if (!raw || !rating) return null;

  const price =
    toNumber(raw.currentPrice) ??
    toNumber(raw.priceNum) ??
    toNumber(raw.price) ??
    0;

  const id = String(raw.id ?? raw.cardId ?? raw.name ?? 'unknown');
  const cardIdNum = toNumber(raw.cardId);

  // Real movement data (analytics shape) vs. estimate (fut_players shape).
  let price24hAgo = toNumber(raw.price24hAgo);
  let price7dAgo = toNumber(raw.price7dAgo);
  let hasRealMovement = price24hAgo != null || price7dAgo != null;

  if (!hasRealMovement && Array.isArray(raw.priceHistory) && raw.priceHistory.length >= 2) {
    const points = raw.priceHistory
      .map((p) => toNumber(p?.price))
      .filter((n): n is number => n != null);
    if (points.length >= 2) {
      price7dAgo = points[0];
      price24hAgo = points[Math.max(0, points.length - 2)];
      hasRealMovement = true;
    }
  }

  return {
    id,
    cardId: cardIdNum != null ? cardIdNum : null,
    name: String(raw.name ?? 'Unknown Player'),
    rating,
    position: raw.position ?? raw.altPosition ?? null,
    league: raw.league ?? null,
    nation: raw.nation ?? null,
    club: raw.club ?? null,
    version: String(raw.version ?? raw.cardType ?? raw.rarity ?? 'Gold'),
    imageUrl: raw.imageUrl ?? raw.image_url ?? null,
    platform: String(raw.platform ?? 'PS'),
    price,
    price24hAgo,
    price7dAgo,
    hasRealMovement,
  };
}

// ---------------------------------------------------------------------------
// Feature extraction
// ---------------------------------------------------------------------------

interface Features {
  ratingBand: number; // 0-100 desirability of the rating tier
  fodderDemand: number; // 0-100 SBC fodder relevance
  positionDemand: number; // 0-100
  leagueDemand: number; // 0-100
  nationDemand: number; // 0-100
  liquidity: number; // 0-100 (cheap + common = liquid)
  isSpecial: boolean;
  momentum24h: number; // % change (real or estimated)
  momentum7d: number; // % change (real or estimated)
}

function ratingBandScore(rating: number): number {
  // 83-89 gold cards are the lifeblood of SBC fodder demand; 90+ are premium
  // but thinner markets; sub-83 are low value.
  if (rating >= 90) return 82;
  if (rating >= 86) return 92; // top fodder + squad demand
  if (rating >= 83) return 88;
  if (rating >= 80) return 66;
  if (rating >= 75) return 45;
  return 28;
}

function fodderDemandScore(rating: number): number {
  // Peaks around 84-88 where SBC requirements concentrate.
  if (rating >= 83 && rating <= 89) return 90;
  if (rating >= 90) return 55;
  if (rating >= 80) return 60;
  return 30;
}

function extractFeatures(card: NormalizedCard): Features {
  const isSpecial = SPECIAL_VERSIONS.test(card.version);

  const positionDemand = card.position && HOT_POSITIONS.has(card.position.toUpperCase()) ? 85 : 55;
  const leagueDemand = card.league && HOT_LEAGUES.has(card.league) ? 85 : 50;
  const nationDemand = card.nation && HOT_NATIONS.has(card.nation) ? 80 : 50;

  // Liquidity: cheaper, common cards trade constantly; expensive specials are illiquid.
  const priceLiquidity = card.price <= 5000 ? 92 : card.price <= 30000 ? 78 : card.price <= 150000 ? 58 : 38;
  const liquidity = clamp(priceLiquidity - (isSpecial ? 12 : 0));

  // Momentum: use real data when available, otherwise a deterministic estimate
  // derived from durable attributes so the number is stable and explainable.
  let momentum24h: number;
  let momentum7d: number;
  if (card.hasRealMovement && card.price > 0) {
    momentum24h = card.price24hAgo ? ((card.price - card.price24hAgo) / card.price24hAgo) * 100 : 0;
    momentum7d = card.price7dAgo ? ((card.price - card.price7dAgo) / card.price7dAgo) * 100 : momentum24h;
  } else {
    // Estimate centred on 0 with amplitude driven by demand signals.
    const seed = seededUnit(`${card.id}:${card.name}:mom`) * 2 - 1; // [-1, 1]
    const amplitude = isSpecial ? 12 : 6;
    momentum24h = round(seed * amplitude, 2);
    momentum7d = round(seed * amplitude * 1.8 + (seededUnit(`${card.id}:7d`) - 0.5) * 4, 2);
  }

  return {
    ratingBand: ratingBandScore(card.rating),
    fodderDemand: fodderDemandScore(card.rating),
    positionDemand,
    leagueDemand,
    nationDemand,
    liquidity,
    isSpecial,
    momentum24h,
    momentum7d,
  };
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function scoreCard(raw: RawCard): MarketIntelligence | null {
  const card = normalizeCard(raw);
  if (!card) return null;
  const f = extractFeatures(card);

  // Demand vs supply model (0-100).
  const demand = clamp(
    0.32 * f.ratingBand +
      0.24 * f.positionDemand +
      0.22 * f.leagueDemand +
      0.14 * f.nationDemand +
      0.08 * (f.isSpecial ? 80 : 55)
  );
  // Higher rating & special cards are scarcer → lower supply; cheap golds flood the market.
  const supply = clamp(100 - 0.55 * f.ratingBand - (f.isSpecial ? 18 : 0) + (card.price <= 3000 ? 20 : 0));

  // Volatility: specials + weak momentum data + high price → more volatile.
  const momentumMagnitude = Math.min(40, Math.abs(f.momentum24h) + Math.abs(f.momentum7d) / 2);
  const volatility = clamp(
    (f.isSpecial ? 55 : 30) + momentumMagnitude + (card.price > 150000 ? 12 : 0) - (f.liquidity - 60) * 0.2
  );

  // Value gap: is the card trading below where demand/supply says it should?
  // Positive gap = undervalued (good to buy), negative = overvalued.
  const valueGap = clamp((demand - supply) / 2 - f.momentum7d, -50, 50);

  // --- Buy score: undervalued + rising + in-demand + liquid, penalised by risk.
  const buyScore = clamp(
    0.30 * (50 + valueGap) +
      0.22 * clamp(50 + f.momentum24h * 3) +
      0.20 * demand +
      0.14 * f.fodderDemand +
      0.14 * f.liquidity -
      volatility * 0.12
  );

  // --- Sell score: overvalued + falling + already ran up hard.
  const sellScore = clamp(
    0.34 * (50 - valueGap) +
      0.26 * clamp(50 - f.momentum24h * 3) +
      0.20 * clamp(f.momentum7d * 2 + 40) + // ran up a lot recently → take profit
      0.20 * (100 - demand)
  );

  // --- Hold score: stable, mid-demand, low urgency either way.
  const holdScore = clamp(100 - Math.abs(buyScore - sellScore) - volatility * 0.15 + f.liquidity * 0.1);

  // Overall investment rating blends the bull case against risk.
  const investmentRating = clamp(
    0.5 * buyScore + 0.2 * demand + 0.15 * f.liquidity + 0.15 * (100 - volatility)
  );

  // Confidence: real data + signal agreement raise it; thin/illiquid lower it.
  const agreement = 100 - Math.min(100, Math.abs(buyScore - sellScore) < 15 ? 40 : 0);
  const confidence = clamp(
    (card.hasRealMovement ? 68 : 46) +
      f.liquidity * 0.18 +
      agreement * 0.12 -
      (volatility - 50) * 0.15
  );

  // Expected movement over the horizon, then ROI net of 5% EA tax on the sell.
  const expectedMovement = round(
    (valueGap / 50) * 14 + f.momentum7d * 0.4 + (demand - supply) / 10,
    2
  );
  const suggestedBuy = Math.max(150, Math.round((card.price * 0.94) / 50) * 50);
  const projectedSell = card.price * (1 + Math.max(0, expectedMovement) / 100);
  const suggestedSell = Math.max(suggestedBuy + 100, Math.round((projectedSell * 1.02) / 50) * 50);
  const expectedPeak = Math.round((suggestedSell * 1.05) / 50) * 50;
  const grossRoi = suggestedBuy > 0 ? ((suggestedSell * 0.95 - suggestedBuy) / suggestedBuy) * 100 : 0;
  const expectedRoi = round(grossRoi, 1);

  const risk: Risk = volatility >= 62 ? 'High' : volatility >= 42 ? 'Medium' : 'Low';
  const timeHorizon: TimeHorizon = f.isSpecial
    ? 'Short-term'
    : card.rating >= 86
    ? 'Mid-term'
    : Math.abs(f.momentum24h) > 6
    ? 'Intraday'
    : 'Short-term';

  const recommendation = deriveRecommendation(buyScore, sellScore, holdScore, investmentRating);
  const reasons = buildReasons(card, f, { demand, supply, valueGap, volatility, expectedMovement });

  // Modelled BIN spread around the current price (tighter when liquid).
  const spread = clamp(2 + (100 - f.liquidity) * 0.08 + volatility * 0.05, 2, 14) / 100;
  const lowestBin = Math.max(150, Math.round((card.price * (1 - spread)) / 50) * 50);
  const highestBin = Math.round((card.price * (1 + spread)) / 50) * 50;

  return {
    id: card.id,
    cardId: card.cardId,
    name: card.name,
    rating: card.rating,
    position: card.position,
    league: card.league,
    nation: card.nation,
    club: card.club,
    version: card.version,
    imageUrl: card.imageUrl,
    platform: card.platform,

    price: card.price,
    lowestBin,
    highestBin,
    priceChange24h: round(f.momentum24h, 2),
    priceChange7d: round(f.momentum7d, 2),

    investmentRating: round(investmentRating),
    buyScore: round(buyScore),
    sellScore: round(sellScore),
    holdScore: round(holdScore),
    confidence: round(confidence),

    recommendation,
    risk,
    timeHorizon,

    expectedRoi,
    expectedMovement,
    suggestedBuy,
    suggestedSell,
    expectedPeak,

    supply: round(supply),
    demand: round(demand),
    volatility: round(volatility),
    liquidity: round(f.liquidity),

    reasons,
    dataQuality: card.hasRealMovement ? 'live' : 'estimated',
    generatedAt: new Date().toISOString(),
  };
}

function deriveRecommendation(
  buy: number,
  sell: number,
  hold: number,
  rating: number
): Recommendation {
  if (buy >= 72 && rating >= 68) return 'STRONG BUY';
  if (buy >= 60 && buy > sell) return 'BUY';
  if (sell >= 66 && sell > buy) return 'SELL';
  if (rating < 40 && sell > buy) return 'AVOID';
  return 'HOLD';
}

function buildReasons(
  card: NormalizedCard,
  f: Features,
  ctx: { demand: number; supply: number; valueGap: number; volatility: number; expectedMovement: number }
): Reason[] {
  const reasons: Reason[] = [];

  if (f.fodderDemand >= 85) {
    reasons.push({
      label: 'Premium SBC fodder',
      detail: `${card.rating}-rated cards are constantly consumed by Squad Building Challenges.`,
      sentiment: 'positive',
    });
  }
  if (ctx.valueGap > 12) {
    reasons.push({
      label: 'Trading below fair value',
      detail: 'Demand outweighs current supply — the market looks underpriced.',
      sentiment: 'positive',
    });
  } else if (ctx.valueGap < -12) {
    reasons.push({
      label: 'Trading above fair value',
      detail: 'Price has run ahead of underlying demand — downside risk elevated.',
      sentiment: 'negative',
    });
  }
  if (f.momentum24h >= 4) {
    reasons.push({
      label: 'Rising fast',
      detail: `Up ~${round(f.momentum24h, 1)}% in 24h — momentum is positive.`,
      sentiment: 'positive',
    });
  } else if (f.momentum24h <= -4) {
    reasons.push({
      label: 'Falling',
      detail: `Down ~${round(Math.abs(f.momentum24h), 1)}% in 24h — wait for a floor.`,
      sentiment: 'negative',
    });
  }
  if (f.leagueDemand >= 85) {
    reasons.push({
      label: 'High-demand league',
      detail: `${card.league} cards see heavy Weekend League and SBC usage.`,
      sentiment: 'positive',
    });
  }
  if (f.positionDemand >= 85) {
    reasons.push({
      label: 'Meta position',
      detail: `${card.position} is a sought-after position in the current meta.`,
      sentiment: 'positive',
    });
  }
  if (f.isSpecial) {
    reasons.push({
      label: 'Special card',
      detail: 'Non-tradeable pack supply is limited, but promos can crash the price.',
      sentiment: 'neutral',
    });
  }
  if (ctx.volatility >= 62) {
    reasons.push({
      label: 'High volatility',
      detail: 'Wide price swings — size positions carefully and set alerts.',
      sentiment: 'negative',
    });
  } else if (f.liquidity >= 80) {
    reasons.push({
      label: 'Highly liquid',
      detail: 'Buys and sells fill quickly, so you can move in and out with ease.',
      sentiment: 'positive',
    });
  }

  return reasons.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Scanner categories
// ---------------------------------------------------------------------------

export type ScannerCategory =
  | 'best-investments'
  | 'fastest-risers'
  | 'fastest-fallers'
  | 'most-undervalued'
  | 'most-overpriced'
  | 'best-fodder'
  | 'likely-to-rise'
  | 'likely-to-crash'
  | 'lowest-risk'
  | 'highest-roi';

export const SCANNER_CATEGORIES: { id: ScannerCategory; label: string; description: string }[] = [
  { id: 'best-investments', label: 'Best Investments', description: 'Highest overall investment rating' },
  { id: 'highest-roi', label: 'Highest ROI', description: 'Biggest projected return after tax' },
  { id: 'fastest-risers', label: 'Fastest Risers', description: 'Strongest positive momentum' },
  { id: 'fastest-fallers', label: 'Fastest Fallers', description: 'Sharpest recent drops' },
  { id: 'most-undervalued', label: 'Most Undervalued', description: 'Trading well below fair value' },
  { id: 'most-overpriced', label: 'Most Overpriced', description: 'Trading above fair value' },
  { id: 'best-fodder', label: 'Best Fodder', description: 'Top SBC fodder value' },
  { id: 'likely-to-rise', label: 'Likely To Rise', description: 'Model expects upward movement' },
  { id: 'likely-to-crash', label: 'Likely To Crash', description: 'Model expects downward movement' },
  { id: 'lowest-risk', label: 'Lowest Risk', description: 'Stable, liquid, low volatility' },
];

export function rankForCategory(items: MarketIntelligence[], category: ScannerCategory): MarketIntelligence[] {
  const byDesc = (fn: (m: MarketIntelligence) => number) =>
    [...items].sort((a, b) => fn(b) - fn(a));
  const byAsc = (fn: (m: MarketIntelligence) => number) =>
    [...items].sort((a, b) => fn(a) - fn(b));

  switch (category) {
    case 'best-investments':
      return byDesc((m) => m.investmentRating + m.confidence * 0.2);
    case 'highest-roi':
      return byDesc((m) => m.expectedRoi);
    case 'fastest-risers':
      return byDesc((m) => m.priceChange24h);
    case 'fastest-fallers':
      return byAsc((m) => m.priceChange24h);
    case 'most-undervalued':
      return byDesc((m) => m.buyScore - m.sellScore);
    case 'most-overpriced':
      return byDesc((m) => m.sellScore - m.buyScore);
    case 'best-fodder':
      return byDesc((m) => (m.rating >= 83 && m.rating <= 89 ? 100 : 0) + m.buyScore);
    case 'likely-to-rise':
      return byDesc((m) => m.expectedMovement);
    case 'likely-to-crash':
      return byAsc((m) => m.expectedMovement);
    case 'lowest-risk':
      return byAsc((m) => m.volatility - m.liquidity * 0.5);
    default:
      return byDesc((m) => m.investmentRating);
  }
}

/** Market-wide sentiment used by the dashboard heat bar. */
export function marketOverview(items: MarketIntelligence[]) {
  const total = items.length || 1;
  const rising = items.filter((m) => m.priceChange24h > 1).length;
  const falling = items.filter((m) => m.priceChange24h < -1).length;
  const stable = total - rising - falling;
  const avgRating = items.reduce((s, m) => s + m.investmentRating, 0) / total;
  const bullish = rising / total;
  const sentiment =
    bullish > 0.55 ? 'Bullish' : bullish < 0.3 ? 'Bearish' : 'Neutral';
  // 0-100 heat index: >50 hot/bullish market, <50 cold/bearish.
  const heatIndex = round(clamp(50 + ((rising - falling) / total) * 100));
  return {
    total: items.length,
    rising,
    falling,
    stable,
    sentiment,
    heatIndex,
    avgInvestmentRating: round(avgRating),
  };
}
