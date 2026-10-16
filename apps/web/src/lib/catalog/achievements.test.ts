import { describe, expect, it } from 'vitest';
import { getAchievements } from '.';
import { buildGameAchievements, combineSummaries, latestHighlights } from './achievements';

function entry(overrides: Record<string, unknown>) {
  return {
    id: 'x',
    game: 'pubgm',
    division: 'Alter Ego Ares',
    tournament: 'Cup',
    tier: 'A-Tier',
    startDate: '2025-01-01',
    endDate: null,
    placement: '3',
    placementLabel: '3rd',
    prize: null,
    location: null,
    lan: null,
    rosterIds: [],
    awards: [],
    highlight: false,
    liquipediaUrl: null,
    sources: [],
    ...overrides,
  };
}

const file = (achievements: unknown[], summary: Record<string, number | null> = {}) => ({
  game: 'pubgm',
  updatedAt: '2026-10-16',
  summary: { titles: null, runnerUps: null, internationalAppearances: null, totalPrizeUSD: null, ...summary },
  achievements,
});

describe('buildGameAchievements', () => {
  it('sorts newest first and puts undated entries last', () => {
    const result = buildGameAchievements(
      file([
        entry({ id: 'undated', startDate: null }),
        entry({ id: 'old', startDate: '2023-04-16' }),
        entry({ id: 'new', startDate: '2026-08-30' }),
      ]),
      'data/pubgm_achievement.json',
    );
    expect(result.achievements.map((a) => a.id)).toEqual(['new', 'old', 'undated']);
  });

  it('derives missing summary values from the list and keeps values given in the file', () => {
    const result = buildGameAchievements(
      file(
        [
          entry({ placement: '1', tier: 'A-Tier', prize: { amount: 100, currency: 'USD' } }),
          entry({ placement: '1', tier: 'S-Tier', prize: { amount: 50.5, currency: 'USD' } }),
          entry({ placement: '2', tier: 'S-Tier' }),
          entry({ placement: '1-2', tier: 'Qualifier' }),
        ],
        { totalPrizeUSD: 9999 },
      ),
      'data/pubgm_achievement.json',
    );
    expect(result.summary).toEqual({
      titles: 2,
      runnerUps: 1,
      internationalAppearances: 2,
      totalPrizeUSD: 9999,
    });
  });

  it('fails with the file and entry when data is malformed', () => {
    expect(() =>
      buildGameAchievements(file([entry({ placement: '' })]), 'data/pubgm_achievement.json'),
    ).toThrowError(/data\/pubgm_achievement\.json → achievements\[0\]\.placement/);
  });
});

describe('latestHighlights', () => {
  it('returns at most six newest highlighted entries across games', () => {
    const a = buildGameAchievements(
      file(
        Array.from({ length: 5 }, (_, i) =>
          entry({ id: `p${i}`, highlight: true, startDate: `2025-0${i + 1}-01` }),
        ),
      ),
      'a',
    );
    const b = buildGameAchievements(
      {
        ...file([
          entry({ id: 'm-new', game: 'mlbb', highlight: true, startDate: '2026-01-25' }),
          entry({ id: 'm-hidden', game: 'mlbb', highlight: false, startDate: '2026-12-01' }),
          entry({ id: 'm-old', game: 'mlbb', highlight: true, startDate: '2020-01-01' }),
        ]),
        game: 'mlbb',
      },
      'b',
    );
    expect(latestHighlights([a, b]).map((x) => x.id)).toEqual(['m-new', 'p4', 'p3', 'p2', 'p1', 'p0']);
  });
});

describe('getAchievements (real data)', () => {
  it('fills the PUBG Mobile summary that is null in the data file', () => {
    const { games, total, highlights } = getAchievements();
    const pubgm = games.find((g) => g.game === 'pubgm')!;
    expect(pubgm.summary.titles).toBeGreaterThan(0);
    expect(pubgm.summary.totalPrizeUSD).toBe(653239);
    expect(total.titles).toBe(combineSummaries(games).titles);
    expect(highlights).toHaveLength(6);
  });
});
