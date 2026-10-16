// Catalog: the single entry point for site content. Pages and components never read raw data files.
import type { Achievement, AchievementSummary } from '@alterego/shared';
import mlbbRoster from '@data/mlbb.json';
import cs2Roster from '@data/cs2.json';
import pubgmRoster from '@data/pubgm.json';
import mlbbAchievements from '@data/mlbb_achievement.json';
import cs2Achievements from '@data/cs2_achievement.json';
import pubgmAchievements from '@data/pubgm_achievement.json';
import { buildGameAchievements, combineSummaries, latestHighlights, type GameAchievements } from './achievements';
import { buildGameRoster, type GameRoster } from './roster';

export type { GameAchievements } from './achievements';
export type { GameRoster, RosterDivision, RosterMember } from './roster';
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
