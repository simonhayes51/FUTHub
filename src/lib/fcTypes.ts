// Types for the FC Edge feature APIs (SBC, Packs, Evolutions, Objectives,
// Squads, Coach, News, Dashboard). Mirrors server/routes/* responses.
import type { MarketIntelligence } from './marketTypes';

export interface MarketOverviewStats {
  total: number;
  rising: number;
  falling: number;
  stable: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  heatIndex: number;
  avgInvestmentRating: number;
}

// --- SBC ---
export interface SbcSegmentSummary {
  label: string;
  players: number;
  targetRating: number;
  cost: number;
}
export interface SbcListItem {
  id: string;
  name: string;
  category: string;
  description: string;
  expiresInDays: number;
  repeatable: boolean;
  reward: { type: string; name: string; estValue: number; tradeable: boolean };
  estimatedCost: number;
  expectedReturn: number;
  profit: number;
  roi: number;
  valueRating: number;
  difficulty: number;
  shouldComplete: boolean;
  verdict: string;
  segments: SbcSegmentSummary[];
}
export interface SbcSolvedSlot { rating: number; price: number; name: string }
export interface SbcDetail extends Omit<SbcListItem, 'segments'> {
  solution: { segments: Array<SbcSegmentSummary & { achievedRating: number; slots: SbcSolvedSlot[] }>; totalCost: number };
}

// --- Packs ---
export interface PackTier { label: string; min: number; max: number; probability: number }
export interface PackItem {
  id: string;
  name: string;
  priceCoins: number | null;
  pricePoints: number | null;
  rareCount: number;
  totalItems: number;
  tradeable: boolean;
  tiers: PackTier[];
  expectedValue: number;
  evVsCoinsPercent: number | null;
  chanceOf88: number;
  verdict: string;
}
export interface PackPull { rating: number; tier: string; value: number; isWalkout: boolean }
export interface PackSimResult {
  packId: string;
  packName: string;
  count: number;
  seed: string;
  opens: PackPull[][];
  totalValue: number;
  cost: number;
  netProfit: number | null;
  bestPull: number;
  expectedValue: number;
}

// --- Evolutions ---
export interface EvolutionItem {
  id: string;
  name: string;
  costCoins: number;
  costPoints: number;
  description: string;
  upgrades: string[];
  levels: number;
  metaScore: number;
  candidateCount: number;
  cheapestEntry: { name: string; rating: number; price: number } | null;
  entryCost: number;
  isFree: boolean;
  valueRating: number;
  recommended: boolean;
  candidates?: MarketIntelligence[];
}

// --- Objectives ---
export interface ObjectiveItem {
  id: string;
  group: string;
  name: string;
  description: string;
  xp: number;
  rewardName: string;
  rewardValue: number;
  estMinutes: number;
  progress: number;
  priority?: number;
}
export interface ObjectivesResponse {
  groups: { Daily: ObjectiveItem[]; Weekly: ObjectiveItem[]; Season: ObjectiveItem[] };
  count: number;
}
export interface RoadmapResponse {
  generatedAt: string;
  tasks: Array<{ order: number; id: string; name: string; group: string; reward: string; rewardValue: number; estMinutes: number; why: string }>;
  forecast: { coinsToEarn: number; xpToEarn: number; estMinutes: number };
}

// --- Squads ---
export interface SquadSlotPriced { position: string; archetype: string; rating: number; name: string; price: number }
export interface SquadItem {
  id: string;
  name: string;
  formation: string;
  budgetTier: string;
  playstyle: string;
  chemistry: number;
  estCost: number;
  rating: number;
  slots: SquadSlotPriced[];
}

// --- Coach ---
export interface CoachResponse {
  intent: string;
  answer: string;
  data: {
    cards?: Array<Pick<MarketIntelligence, 'id' | 'name' | 'rating' | 'price' | 'recommendation' | 'investmentRating' | 'expectedRoi'>>;
    sbcs?: Array<{ id: string; name: string; category: string; rewardValue: number; repeatable: boolean; expiresInDays: number }>;
    objectives?: ObjectiveItem[];
    overview?: MarketOverviewStats;
    targetCoins?: number;
  } | null;
  generatedAt: string;
}

// --- News ---
export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  hoursAgo: number;
  impact: 'high' | 'medium' | 'low';
}
export interface NewsResponse { count: number; categories: string[]; items: NewsItem[] }

// --- Dashboard ---
export interface DashboardResponse {
  greeting: string;
  assistant: string[];
  overview: MarketOverviewStats;
  topPicks: MarketIntelligence[];
  risers: MarketIntelligence[];
  fallers: MarketIntelligence[];
  sbcs: Array<{ id: string; name: string; category: string; rewardValue: number; expiresInDays: number; repeatable: boolean }>;
  objectives: ObjectiveItem[];
  news: NewsItem[];
  generatedAt: string;
}
