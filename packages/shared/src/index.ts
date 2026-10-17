// Domain types shared by the web app and (from Fase 6) the NestJS API.
// Raw data shapes follow data/PROMPTS_ROSTER_ACHIEVEMENT.md.

export type Game = 'mlbb' | 'cs2' | 'pubgm';

export const GAMES: readonly Game[] = ['mlbb', 'cs2', 'pubgm'];

export const GAME_LABELS: Record<Game, string> = {
  mlbb: 'Mobile Legends',
  cs2: 'Counter-Strike 2',
  pubgm: 'PUBG Mobile',
};

export type StoreMode = 'marketplace' | 'native';

export type PlayerStatus = 'active' | 'substitute' | 'inactive' | 'loan';

export interface Player {
  id: string;
  nickname: string;
  fullName: string | null;
  nationality: string | null;
  game: Game;
  division: string;
  type: 'player' | 'staff';
  role: string | null;
  status: PlayerStatus;
  joinDate: string | null;
  previousTeams: string[];
  liquipediaUrl: string | null;
  photo: string | null;
  /** Fallback photo (a remote profile image) used when `photo` is empty. */
  profileImg: string | null;
  displayOrder: number;
  gameSpecific: Record<string, unknown>;
  sources: string[];
}

export interface Prize {
  amount: number;
  currency: string;
}

export interface Achievement {
  id: string;
  game: Game;
  division: string;
  tournament: string;
  tier: string | null;
  startDate: string | null;
  endDate: string | null;
  placement: string;
  placementLabel: string;
  prize: Prize | null;
  location: string | null;
  lan: boolean | null;
  rosterIds: string[];
  awards: { playerId: string; award: string }[];
  highlight: boolean;
  liquipediaUrl: string | null;
  sources: string[];
  totalPoints?: number | null;
  totalKills?: number | null;
}

export interface AchievementSummary {
  titles: number;
  runnerUps: number;
  internationalAppearances: number;
  totalPrizeUSD: number;
}

export type ProductCategory = 'jersey' | 'jacket' | 'hoodie' | 'tshirt' | 'bottoms' | 'accessory' | 'other';

export type ProductBadge = 'NEW' | 'LIMITED' | 'SOLD OUT' | 'PRE-ORDER';

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  priceMin: number;
  priceMax: number;
  images: string[];
  descriptionBlocks: string[];
  badge?: ProductBadge;
  shopeeUrl: string;
  tokopediaUrl: string;
  variants?: ProductVariant[];
}
