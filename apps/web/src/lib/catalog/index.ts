// Catalog: the single entry point for site content. Pages and components never read raw data files.
import mlbbRoster from '@data/mlbb.json';
import cs2Roster from '@data/cs2.json';
import pubgmRoster from '@data/pubgm.json';
import { buildGameRoster, type GameRoster } from './roster';

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
