import { GAME_LABELS, type Game, type Player } from '@alterego/shared';
import { z } from 'zod';
import { parseDataFile } from './validate';

const gameSchema = z.enum(['mlbb', 'cs2', 'pubgm']);

const playerSchema = z.object({
  id: z.string().min(1),
  nickname: z.string().min(1),
  fullName: z.string().nullable(),
  nationality: z.string().length(2).nullable(),
  game: gameSchema,
  division: z.string().min(1),
  type: z.enum(['player', 'staff']),
  role: z.string().nullable(),
  status: z.enum(['active', 'substitute', 'inactive', 'loan']),
  joinDate: z.string().nullable(),
  previousTeams: z.array(z.string()),
  liquipediaUrl: z.string().nullable(),
  photo: z.string().nullable(),
  displayOrder: z.number(),
  gameSpecific: z.record(z.string(), z.unknown()),
  sources: z.array(z.string()),
});

const rosterFileSchema = z.object({
  game: gameSchema,
  updatedAt: z.string(),
  players: z.array(playerSchema),
});

/** A player as shown on the site: raw data plus the label to print under the photo. */
export interface RosterMember extends Player {
  roleLabel: string;
}

export interface RosterDivision {
  name: string;
  players: RosterMember[];
  staff: RosterMember[];
}

export interface GameRoster {
  game: Game;
  label: string;
  divisions: RosterDivision[];
}

const MAIN_DIVISION = 'Alter Ego';

function roleLabel(player: Player): string {
  if (player.role) return player.role;
  if (player.type === 'player' && player.gameSpecific.isIGL === true) return 'IGL';
  return player.type === 'staff' ? 'Staff' : 'Player';
}

function compareDivisions(a: string, b: string): number {
  if (a === MAIN_DIVISION) return -1;
  if (b === MAIN_DIVISION) return 1;
  return a.localeCompare(b);
}

/** Validate one raw roster file (as read from `data/<game>.json`) and group it for display. */
export function buildGameRoster(raw: unknown, file: string): GameRoster {
  const data = parseDataFile(rosterFileSchema, raw, file);
  const visible = data.players.filter((p) => p.status !== 'inactive');

  const names = [...new Set(visible.map((p) => p.division))].sort(compareDivisions);
  const divisions = names.map((name) => {
    const members = visible
      .filter((p) => p.division === name)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((p) => ({ ...p, roleLabel: roleLabel(p) }));
    return {
      name,
      players: members.filter((p) => p.type === 'player'),
      staff: members.filter((p) => p.type === 'staff'),
    };
  });

  return { game: data.game, label: GAME_LABELS[data.game], divisions };
}
