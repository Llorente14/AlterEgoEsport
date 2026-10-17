// Catalog: the single entry point for site content. Pages and components never read raw data files.
import type { Achievement, AchievementSummary, ProductCategory } from '@alterego/shared';
import mlbbRoster from '@data/mlbb.json';
import cs2Roster from '@data/cs2.json';
import pubgmRoster from '@data/pubgm.json';
import mlbbAchievements from '@data/mlbb_achievement.json';
import cs2Achievements from '@data/cs2_achievement.json';
import pubgmAchievements from '@data/pubgm_achievement.json';
import rawLinks from '@data/links.json';
import rawFounders from '@data/founders.json';
import rawPartners from '@data/partners.json';
import rawProducts from '@data/alterego_produk_aktif_gambar.json';
import productImages from '../../data/product-images.json';
import { buildGameAchievements, combineSummaries, latestHighlights, type GameAchievements } from './achievements';
import { buildFounders, type Founder } from './founders';
import { buildLinks, type SiteLinks } from './links';
import { buildPartners, type Partner } from './partners';
import { buildProducts, CATEGORY_LABELS, type StoreProduct } from './products';
import { buildGameRoster, buildRosterTabs, type GameRoster, type RosterTab } from './roster';

export type { GameAchievements } from './achievements';
export type { SiteLinks } from './links';
export type { Founder } from './founders';
export type { Partner } from './partners';
export type { ProductImage, StoreProduct } from './products';
export type { GameRoster, RosterDivision, RosterMember, RosterTab } from './roster';
export { CATEGORY_LABELS } from './products';
export { CatalogDataError } from './validate';

let roster: GameRoster[] | undefined;

/** Active roster per game, in tab order (MLBB · CS2 · PUBG Mobile). */
export function getRoster(): GameRoster[] {
  roster ??= [
    buildGameRoster(mlbbRoster, 'data/mlbb.json'),
    buildGameRoster(cs2Roster, 'data/cs2.json'),
    buildGameRoster(pubgmRoster, 'data/pubgm.json'),
  ];
  return roster;
}

/** Roster tabs in display order: Mobile Legends MPL · MDL, Counter-Strike 2, PUBG Mobile. */
export function getRosterTabs(): RosterTab[] {
  return buildRosterTabs(getRoster());
}

export interface AchievementsOverview {
  games: GameAchievements[];
  total: AchievementSummary;
  /** Up to six newest highlighted achievements across games, for the landing page. */
  highlights: Achievement[];
}

let achievements: AchievementsOverview | undefined;

export function getAchievements(): AchievementsOverview {
  if (!achievements) {
    const games = [
      buildGameAchievements(mlbbAchievements, 'data/mlbb_achievement.json'),
      buildGameAchievements(cs2Achievements, 'data/cs2_achievement.json'),
      buildGameAchievements(pubgmAchievements, 'data/pubgm_achievement.json'),
    ];
    achievements = { games, total: combineSummaries(games), highlights: latestHighlights(games) };
  }
  return achievements;
}

let links: SiteLinks | undefined;

/** Marketplaces, social accounts and the offline store. */
export function getLinks(): SiteLinks {
  links ??= buildLinks(rawLinks, 'data/links.json');
  return links;
}

let founders: Founder[] | undefined;

/** People shown in the Founder carousel, in display order. */
export function getFounders(): Founder[] {
  founders ??= buildFounders(rawFounders, 'data/founders.json');
  return founders;
}

let partners: Partner[] | undefined;

/** Official partners in display order. */
export function getPartners(): Partner[] {
  partners ??= buildPartners(rawPartners, 'data/partners.json');
  return partners;
}

let products: StoreProduct[] | undefined;

/** All active Alter Merch products, in the order of the data file. */
export function getProducts(): StoreProduct[] {
  products ??= buildProducts(rawProducts, 'data/alterego_produk_aktif_gambar.json', {
    images: productImages,
    shopeeFallback: getLinks().shopeeHome,
    tokopediaFallback: getLinks().tokopedia.url,
  });
  return products;
}

export function getProduct(slug: string): StoreProduct | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export interface CategoryCount {
  category: ProductCategory;
  label: string;
  count: number;
}

/** Categories that have at least one product, in menu order. */
export function getCategories(): CategoryCount[] {
  const all = getProducts();
  return (Object.keys(CATEGORY_LABELS) as ProductCategory[])
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      count: all.filter((p) => p.category === category).length,
    }))
    .filter((c) => c.count > 0);
}
