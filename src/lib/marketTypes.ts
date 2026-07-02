// Shared types for the FC Edge Market Intelligence feature.
// Mirrors the shape returned by /api/market/* (server/lib/marketIntelligence.ts).

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

  investmentRating: number;
  buyScore: number;
  sellScore: number;
  holdScore: number;
  confidence: number;

  recommendation: Recommendation;
  risk: Risk;
  timeHorizon: TimeHorizon;

  expectedRoi: number;
  expectedMovement: number;
  suggestedBuy: number;
  suggestedSell: number;
  expectedPeak: number;

  supply: number;
  demand: number;
  volatility: number;
  liquidity: number;

  reasons: Reason[];
  dataQuality: 'live' | 'estimated';
  generatedAt: string;
}

export interface ScannerCategoryMeta {
  id: string;
  label: string;
  description: string;
}

export interface ScannerResponse {
  category: string;
  label?: string;
  description?: string;
  count: number;
  items: MarketIntelligence[];
  cachedAt: string;
}

export interface MarketOverviewResponse {
  overview: {
    total: number;
    rising: number;
    falling: number;
    stable: number;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    heatIndex: number;
    avgInvestmentRating: number;
  };
  topPicks: MarketIntelligence[];
  risers: MarketIntelligence[];
  fallers: MarketIntelligence[];
  cachedAt: string;
}

export interface IntelligenceResponse {
  intelligence: MarketIntelligence;
  alternatives: MarketIntelligence[];
}
