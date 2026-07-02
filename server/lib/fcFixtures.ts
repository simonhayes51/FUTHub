/**
 * FC Edge sample content fixtures.
 *
 * These are illustrative, self-contained datasets so the SBC / Pack / Evolution
 * / Objective / Squad / News features are fully functional without a live EA
 * data feed. Structure mirrors what a real ingestion pipeline would populate,
 * so swapping in a live source later is a data change, not a code change.
 */

// ---------------------------------------------------------------------------
// SBCs
// ---------------------------------------------------------------------------

export interface SbcRequirement {
  label: string;
  /** Target squad rating for this segment (drives the solver). */
  minSquadRating?: number;
  minChemistry?: number;
  players: number;
  /** Minimum number of special (non-gold) cards required. */
  minSpecials?: number;
  sameNation?: number;
  sameLeague?: number;
}

export interface SbcReward {
  type: 'pack' | 'player';
  name: string;
  /** Modelled coin value of the reward (untradeable rewards use market-equivalent). */
  estValue: number;
  tradeable: boolean;
}

export interface Sbc {
  id: string;
  name: string;
  category: 'Icon' | 'Upgrade' | 'Player' | 'Foundations' | 'Challenge' | 'Marquee';
  description: string;
  /** Days from now until expiry. */
  expiresInDays: number;
  repeatable: boolean;
  requirements: SbcRequirement[];
  reward: SbcReward;
}

export const SBCS: Sbc[] = [
  {
    id: 'sbc-85x10-upgrade',
    name: '85+ x10 Upgrade',
    category: 'Upgrade',
    description: 'Exchange a squad to receive ten 85+ rated rare gold players.',
    expiresInDays: 4,
    repeatable: true,
    requirements: [{ label: 'Squad', minSquadRating: 84, minChemistry: 24, players: 11, minSpecials: 1 }],
    reward: { type: 'pack', name: '85+ x10 Pack', estValue: 62000, tradeable: false },
  },
  {
    id: 'sbc-icon-moore',
    name: 'Icon — Bobby Moore',
    category: 'Icon',
    description: 'Complete the sets to unlock a Mid Icon Bobby Moore.',
    expiresInDays: 12,
    repeatable: false,
    requirements: [
      { label: 'Born Legend', minSquadRating: 84, minChemistry: 20, players: 11 },
      { label: 'League Legend', minSquadRating: 86, minChemistry: 24, players: 11, minSpecials: 1 },
      { label: 'World Class', minSquadRating: 87, minChemistry: 25, players: 11, minSpecials: 2 },
    ],
    reward: { type: 'player', name: 'Bobby Moore (Icon 89)', estValue: 780000, tradeable: false },
  },
  {
    id: 'sbc-foundations',
    name: 'Marquee Foundations',
    category: 'Foundations',
    description: 'Weekly marquee matchup SBC — great pack value for the cost.',
    expiresInDays: 6,
    repeatable: false,
    requirements: [{ label: 'Squad', minSquadRating: 83, minChemistry: 22, players: 11 }],
    reward: { type: 'pack', name: 'Rare Mixed Players Pack', estValue: 25000, tradeable: false },
  },
  {
    id: 'sbc-tots-challenge',
    name: 'TOTS Attacker Challenge',
    category: 'Challenge',
    description: 'A tough challenge rewarding a premium promo player pick.',
    expiresInDays: 2,
    repeatable: false,
    requirements: [
      { label: 'Attack', minSquadRating: 86, minChemistry: 24, players: 11, minSpecials: 2 },
      { label: 'Midfield', minSquadRating: 87, minChemistry: 25, players: 11, minSpecials: 3, sameLeague: 4 },
    ],
    reward: { type: 'pack', name: 'TOTS Player Pick', estValue: 210000, tradeable: false },
  },
  {
    id: 'sbc-84x5',
    name: '84+ x5 Upgrade',
    category: 'Upgrade',
    description: 'Cheap repeatable fodder upgrade — five 84+ rare golds.',
    expiresInDays: 30,
    repeatable: true,
    requirements: [{ label: 'Squad', minSquadRating: 82, minChemistry: 20, players: 11 }],
    reward: { type: 'pack', name: '84+ x5 Pack', estValue: 14000, tradeable: false },
  },
];

// ---------------------------------------------------------------------------
// Packs
// ---------------------------------------------------------------------------

export interface PackTier {
  label: string; // e.g. "84-85", "86-87", "88+"
  min: number;
  max: number;
  probability: number; // 0-1 chance a given rare slot lands in this tier
}

export interface Pack {
  id: string;
  name: string;
  priceCoins: number | null;
  pricePoints: number | null;
  /** Number of tradeable rare "premium" items whose rating we roll. */
  rareCount: number;
  totalItems: number;
  tiers: PackTier[];
  tradeable: boolean;
}

export const PACKS: Pack[] = [
  {
    id: 'pack-premium-gold',
    name: 'Premium Gold Players Pack',
    priceCoins: 25000,
    pricePoints: 150,
    rareCount: 12,
    totalItems: 12,
    tradeable: true,
    tiers: [
      { label: '75-81', min: 75, max: 81, probability: 0.72 },
      { label: '82-84', min: 82, max: 84, probability: 0.2 },
      { label: '85-87', min: 85, max: 87, probability: 0.07 },
      { label: '88+', min: 88, max: 92, probability: 0.01 },
    ],
  },
  {
    id: 'pack-rare-mega',
    name: 'Rare Mega Pack',
    priceCoins: 55000,
    pricePoints: 350,
    rareCount: 30,
    totalItems: 30,
    tradeable: true,
    tiers: [
      { label: '75-81', min: 75, max: 81, probability: 0.6 },
      { label: '82-84', min: 82, max: 84, probability: 0.28 },
      { label: '85-87', min: 85, max: 87, probability: 0.1 },
      { label: '88+', min: 88, max: 93, probability: 0.02 },
    ],
  },
  {
    id: 'pack-ultimate',
    name: 'Ultimate Pack',
    priceCoins: 125000,
    pricePoints: 750,
    rareCount: 12,
    totalItems: 12,
    tradeable: true,
    tiers: [
      { label: '82-84', min: 82, max: 84, probability: 0.55 },
      { label: '85-87', min: 85, max: 87, probability: 0.35 },
      { label: '88-90', min: 88, max: 90, probability: 0.08 },
      { label: '91+', min: 91, max: 94, probability: 0.02 },
    ],
  },
  {
    id: 'pack-83x1',
    name: '83+ x1 Pick',
    priceCoins: 3500,
    pricePoints: null,
    rareCount: 1,
    totalItems: 1,
    tradeable: false,
    tiers: [
      { label: '83-84', min: 83, max: 84, probability: 0.82 },
      { label: '85-86', min: 85, max: 86, probability: 0.15 },
      { label: '87+', min: 87, max: 90, probability: 0.03 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Evolutions
// ---------------------------------------------------------------------------

export interface Evolution {
  id: string;
  name: string;
  costCoins: number;
  costPoints: number;
  description: string;
  /** Eligibility caps a candidate must satisfy. */
  requirements: { maxRating?: number; maxPace?: number; positions?: string[]; maxPrice?: number };
  upgrades: string[];
  levels: number;
  metaScore: number; // 0-100 how meta the resulting card is
}

export const EVOLUTIONS: Evolution[] = [
  {
    id: 'evo-pace-machine',
    name: 'Pace Machine',
    costCoins: 0,
    costPoints: 0,
    description: 'Turn a solid winger into a Weekend League terror with +PAC/+DRI.',
    requirements: { maxRating: 84, positions: ['LW', 'RW', 'LM', 'RM'] },
    upgrades: ['+7 Pace', '+6 Dribbling', '+4 Shooting', '+1 PlayStyle'],
    levels: 3,
    metaScore: 88,
  },
  {
    id: 'evo-midfield-maestro',
    name: 'Midfield Maestro',
    costCoins: 50000,
    costPoints: 0,
    description: 'Upgrade a CM into a two-way engine with a PlayStyle+.',
    requirements: { maxRating: 86, positions: ['CM', 'CDM', 'CAM'] },
    upgrades: ['+5 Passing', '+5 Physical', '+3 Defending', 'Press Proven+'],
    levels: 4,
    metaScore: 82,
  },
  {
    id: 'evo-golden-glove',
    name: 'Golden Glove',
    costCoins: 25000,
    costPoints: 100,
    description: 'A rare GK evolution — worthwhile if you lack a meta keeper.',
    requirements: { maxRating: 83, positions: ['GK'] },
    upgrades: ['+6 Diving', '+5 Reflexes', '+4 Positioning'],
    levels: 3,
    metaScore: 70,
  },
  {
    id: 'evo-defensive-rock',
    name: 'Defensive Rock',
    costCoins: 0,
    costPoints: 0,
    description: 'Free CB upgrade — height + pace makes any budget defender viable.',
    requirements: { maxRating: 82, positions: ['CB'] },
    upgrades: ['+6 Defending', '+5 Physical', '+4 Pace', 'Anticipate+'],
    levels: 3,
    metaScore: 79,
  },
];

// ---------------------------------------------------------------------------
// Objectives
// ---------------------------------------------------------------------------

export interface Objective {
  id: string;
  group: 'Daily' | 'Weekly' | 'Season';
  name: string;
  description: string;
  xp: number;
  rewardName: string;
  rewardValue: number; // modelled coin value
  estMinutes: number;
  /** 0-1 progress (sample). */
  progress: number;
}

export const OBJECTIVES: Objective[] = [
  { id: 'obj-d1', group: 'Daily', name: 'Play 3 Rivals matches', description: 'Win or lose, just play.', xp: 500, rewardName: 'Bronze Pack', rewardValue: 400, estMinutes: 45, progress: 0.33 },
  { id: 'obj-d2', group: 'Daily', name: 'Score with 2 different nations', description: 'In any mode.', xp: 300, rewardName: '150 coins', rewardValue: 150, estMinutes: 20, progress: 0 },
  { id: 'obj-d3', group: 'Daily', name: 'Login reward', description: 'Claim daily gift.', xp: 100, rewardName: 'Gold Pack', rewardValue: 1200, estMinutes: 1, progress: 1 },
  { id: 'obj-w1', group: 'Weekly', name: 'Win 4 Rivals games', description: 'Counts toward weekly rewards.', xp: 2000, rewardName: 'Premium Gold Pack', rewardValue: 7500, estMinutes: 120, progress: 0.25 },
  { id: 'obj-w2', group: 'Weekly', name: 'Score 15 goals in Squad Battles', description: 'Any difficulty.', xp: 1500, rewardName: 'Mixed Players Pack', rewardValue: 5000, estMinutes: 90, progress: 0.4 },
  { id: 'obj-s1', group: 'Season', name: 'Reach Season Level 30', description: 'Unlocks the season reward player.', xp: 8000, rewardName: 'Season Hero (85)', rewardValue: 40000, estMinutes: 600, progress: 0.5 },
];

// ---------------------------------------------------------------------------
// Meta squad templates (for the Squad Builder)
// ---------------------------------------------------------------------------

export interface SquadSlot {
  position: string;
  /** Suggested rating for a budget-appropriate meta option. */
  rating: number;
  archetype: string;
}

export interface SquadTemplate {
  id: string;
  name: string;
  formation: string;
  budgetTier: 'Budget' | 'Mid' | 'Meta' | 'Endgame';
  estCost: number;
  chemistry: number; // out of 33
  playstyle: string;
  slots: SquadSlot[];
}

const F433: string[] = ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CM', 'CM', 'RW', 'ST', 'LW'];

function buildSlots(ratings: number[], archetypes: string[]): SquadSlot[] {
  return F433.map((position, i) => ({ position, rating: ratings[i], archetype: archetypes[i] }));
}

export const SQUAD_TEMPLATES: SquadTemplate[] = [
  {
    id: 'squad-budget-pl',
    name: 'Budget Premier League Meta',
    formation: '4-3-3 (4)',
    budgetTier: 'Budget',
    estCost: 35000,
    chemistry: 33,
    playstyle: 'Fast, direct wing play',
    slots: buildSlots(
      [82, 83, 84, 84, 83, 84, 83, 83, 85, 85, 84],
      ['Sweeper Keeper', 'Overlap', 'Stopper', 'Defend', 'Overlap', 'Holding', 'Box-to-Box', 'Playmaker', 'Inside Forward', 'Poacher', 'Inside Forward']
    ),
  },
  {
    id: 'squad-mid-mixed',
    name: 'Mid-Budget Mixed League',
    formation: '4-3-3 (4)',
    budgetTier: 'Mid',
    estCost: 180000,
    chemistry: 31,
    playstyle: 'Balanced possession',
    slots: buildSlots(
      [86, 85, 86, 86, 85, 86, 86, 85, 87, 88, 87],
      ['Sweeper Keeper', 'Overlap', 'Ball-Playing', 'Defend', 'Overlap', 'Holding', 'Box-to-Box', 'Playmaker', 'Inside Forward', 'Complete Forward', 'Inside Forward']
    ),
  },
  {
    id: 'squad-endgame',
    name: 'Endgame Icon Hybrid',
    formation: '4-3-3 (4)',
    budgetTier: 'Endgame',
    estCost: 3500000,
    chemistry: 33,
    playstyle: 'Elite pace + finishing',
    slots: buildSlots(
      [91, 89, 90, 90, 89, 90, 91, 90, 92, 93, 92],
      ['Sweeper Keeper', 'Attack', 'Ball-Playing', 'Defend', 'Attack', 'Holding', 'Box-to-Box', 'Playmaker', 'Inside Forward', 'Complete Forward', 'Inside Forward']
    ),
  },
];

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface NewsItem {
  id: string;
  category: 'Promo' | 'Leak' | 'SBC' | 'Objective' | 'Market' | 'Patch';
  title: string;
  summary: string;
  hoursAgo: number;
  impact: 'high' | 'medium' | 'low';
}

export const NEWS: NewsItem[] = [
  { id: 'news-1', category: 'Promo', title: 'Team of the Season is live', summary: 'Premier League TOTS drops Friday — expect fodder prices to spike as SBCs release.', hoursAgo: 2, impact: 'high' },
  { id: 'news-2', category: 'Market', title: '85-88 fodder rising ahead of Icon SBC', summary: 'Premium fodder up 8-12% in 24h. Consider selling into the demand.', hoursAgo: 5, impact: 'high' },
  { id: 'news-3', category: 'SBC', title: 'New 85+ x10 upgrade released', summary: 'Repeatable pack. Good value at current fodder prices.', hoursAgo: 6, impact: 'medium' },
  { id: 'news-4', category: 'Leak', title: 'Datamine hints at new Evolutions', summary: 'A free pace + finishing evo may drop next week — hold cheap wingers.', hoursAgo: 12, impact: 'medium' },
  { id: 'news-5', category: 'Objective', title: 'Weekly objectives refreshed', summary: 'New set of Rivals and Squad Battles objectives with a Hero reward.', hoursAgo: 20, impact: 'low' },
];
