import { describe, expect, it } from 'vitest';
import { getRoster } from '.';
import { buildGameRoster } from './roster';
import { CatalogDataError } from './validate';

function member(overrides: Record<string, unknown>) {
  return {
    id: 'x',
    nickname: 'X',
    fullName: null,
    nationality: 'ID',
    game: 'pubgm',
    division: 'Alter Ego',
    type: 'player',
    role: null,
    status: 'active',
    joinDate: null,
    previousTeams: [],
    liquipediaUrl: null,
    photo: null,
    displayOrder: 1,
    gameSpecific: {},
    sources: [],
    ...overrides,
  };
}

const file = (players: unknown[]) => ({ game: 'pubgm', updatedAt: '2026-10-16', players });

describe('buildGameRoster', () => {
  it('groups by division with the main team first, players and staff apart, in display order', () => {
    const roster = buildGameRoster(
      file([
        member({ id: 'coach', type: 'staff', role: 'Coach', division: 'Alter Ego Ares', displayOrder: 1 }),
        member({ id: 'b', division: 'Alter Ego Ares', displayOrder: 3 }),
        member({ id: 'a', division: 'Alter Ego Ares', displayOrder: 2 }),
        member({ id: 'main', division: 'Alter Ego', displayOrder: 1 }),
      ]),
      'data/pubgm.json',
    );

    expect(roster.label).toBe('PUBG Mobile');
    expect(roster.divisions.map((d) => d.name)).toEqual(['Alter Ego', 'Alter Ego Ares']);
    const ares = roster.divisions[1]!;
    expect(ares.players.map((p) => p.id)).toEqual(['a', 'b']);
    expect(ares.staff.map((p) => p.id)).toEqual(['coach']);
  });

  it('labels roles, falling back to IGL or Player when the role is unknown', () => {
    const roster = buildGameRoster(
      file([
        member({ id: 'exp', role: 'EXP Laner' }),
        member({ id: 'igl', gameSpecific: { isIGL: true } }),
        member({ id: 'plain' }),
      ]),
      'data/pubgm.json',
    );
    expect(roster.divisions[0]!.players.map((p) => p.roleLabel)).toEqual(['EXP Laner', 'IGL', 'Player']);
  });

  it('hides inactive members', () => {
    const roster = buildGameRoster(
      file([member({ id: 'gone', status: 'inactive' }), member({ id: 'here' })]),
      'data/pubgm.json',
    );
    expect(roster.divisions[0]!.players.map((p) => p.id)).toEqual(['here']);
  });

  it('fails with the file and entry when data is malformed', () => {
    expect(() =>
      buildGameRoster(file([member({}), member({ nickname: undefined })]), 'data/pubgm.json'),
    ).toThrowError(CatalogDataError);
    expect(() =>
      buildGameRoster(file([member({}), member({ nickname: undefined })]), 'data/pubgm.json'),
    ).toThrowError(/data\/pubgm\.json → players\[1\]\.nickname/);
  });
});

describe('getRoster (real data)', () => {
  it('loads all three games in tab order', () => {
    expect(getRoster().map((r) => r.game)).toEqual(['mlbb', 'cs2', 'pubgm']);
  });
});
