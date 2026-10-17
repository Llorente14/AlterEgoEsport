import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getRoster, getRosterTabs } from '.';
import { buildGameRoster, buildRosterTabs } from './roster';
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
const mlbbFile = (players: unknown[]) => ({ game: 'mlbb', updatedAt: '2026-10-16', players });

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
    ).toThrow(CatalogDataError);
    expect(() =>
      buildGameRoster(file([member({}), member({ nickname: undefined })]), 'data/pubgm.json'),
    ).toThrow(/data\/pubgm\.json → players\[1\]\.nickname/);
  });
});

describe('getRoster (real data)', () => {
  it('loads all three games in tab order', () => {
    expect(getRoster().map((r) => r.game)).toEqual(['mlbb', 'cs2', 'pubgm']);
  });
});

describe('profile image', () => {
  it('keeps profileImg and defaults to null when the data has none', () => {
    const roster = buildGameRoster(
      file([member({ id: 'with', profileImg: 'https://example.com/a.png' }), member({ id: 'without' })]),
      'data/pubgm.json',
    );
    expect(roster.divisions[0]!.players.map((p) => p.profileImg)).toEqual(['https://example.com/a.png', null]);
  });
});

describe('buildRosterTabs', () => {
  const mlbb = (division: string, league: string, id: string) =>
    member({ id, game: 'mlbb', division, gameSpecific: { league } });

  it('gives each league of a game its own tab, main team first', () => {
    const tabs = buildRosterTabs([
      buildGameRoster(
        mlbbFile([mlbb('Alter Ego X', 'MDL ID', 'b'), mlbb('Alter Ego', 'MPL ID', 'a')]),
        'data/mlbb.json',
      ),
    ]);
    expect(tabs.map((t) => [t.id, t.label])).toEqual([
      ['mlbb-mpl', 'Mobile Legends MPL'],
      ['mlbb-mdl', 'Mobile Legends MDL'],
    ]);
    expect(tabs.map((t) => t.divisions.map((d) => d.name))).toEqual([['Alter Ego'], ['Alter Ego X']]);
  });

  it('keeps a game as one tab when it has one division or no league data', () => {
    const one = buildRosterTabs([buildGameRoster(file([member({ id: 'a' })]), 'data/pubgm.json')]);
    expect(one.map((t) => [t.id, t.label])).toEqual([['pubgm', 'PUBG Mobile']]);

    const noLeague = buildRosterTabs([
      buildGameRoster(
        file([member({ id: 'a' }), member({ id: 'b', division: 'Alter Ego Ares' })]),
        'data/pubgm.json',
      ),
    ]);
    expect(noLeague).toHaveLength(1);
    expect(noLeague[0]!.divisions.map((d) => d.name)).toEqual(['Alter Ego', 'Alter Ego Ares']);
  });
});

describe('getRosterTabs (real data)', () => {
  it('lists MPL and MDL as separate options, then CS2 and PUBG Mobile', () => {
    expect(getRosterTabs().map((t) => t.label)).toEqual([
      'Mobile Legends MPL',
      'Mobile Legends MDL',
      'Counter-Strike 2',
      'PUBG Mobile',
    ]);
  });
});

describe('player photos (real data)', () => {
  const publicDir = fileURLToPath(new URL('../../../public', import.meta.url));
  const members = getRoster().flatMap((r) => r.divisions.flatMap((d) => [...d.players, ...d.staff]));

  it('every profile image has a local copy; run `npm run fetch:photos` when this fails', () => {
    const missing = members.filter((m) => m.profileImg && !m.photoSet).map((m) => `${m.game}:${m.id}`);
    expect(missing).toEqual([]);
  });

  it('local copies exist on disk', () => {
    for (const member of members) {
      for (const path of Object.values(member.photoSet?.srcset ?? {})) {
        expect(existsSync(`${publicDir}${path}`), path).toBe(true);
      }
    }
  });

  it('players without any photo keep a null photo set', () => {
    for (const member of members.filter((m) => !m.profileImg)) expect(member.photoSet).toBeNull();
  });
});

describe('buildGameRoster with a photo manifest', () => {
  it('attaches the set by game and id', () => {
    const set = { width: 10, height: 20, srcset: { '400': '/roster/pubgm/a-400.webp', '800': '/roster/pubgm/a-800.webp' } };
    const roster = buildGameRoster(file([member({ id: 'a' }), member({ id: 'b' })]), 'data/pubgm.json', { 'pubgm:a': set });
    expect(roster.divisions[0]!.players.map((p) => p.photoSet)).toEqual([set, null]);
  });
});
