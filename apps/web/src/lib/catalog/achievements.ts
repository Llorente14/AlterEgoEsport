import { GAME_LABELS, type Achievement, type AchievementSummary, type Game } from '@alterego/shared';
import { z } from 'zod';
import { parseDataFile } from './validate';

const achievementSchema = z.object({
  id: z.string().min(1),
  game: z.enum(['mlbb', 'cs2', 'pubgm']),
  division: z.string().min(1),
  tournament: z.string().min(1),
  tier: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  placement: z.string().min(1),
  placementLabel: z.string().min(1),
  prize: z.object({ amount: z.number(), currency: z.string() }).nullable(),
  location: z.string().nullable(),
  lan: z.boolean().nullable(),
  rosterIds: z.array(z.string()),
  awards: z.array(z.object({ playerId: z.string(), award: z.string() })),
  highlight: z.boolean(),
  liquipediaUrl: z.string().nullable(),
  sources: z.array(z.string()),
  totalPoints: z.number().nullable().optional(),
  totalKills: z.number().nullable().optional(),
});

const nullableCount = z.number().nullable();

const achievementFileSchema = z.object({
  game: z.enum(['mlbb', 'cs2', 'pubgm']),
  updatedAt: z.string(),
  summary: z.object({
    titles: nullableCount,
    runnerUps: nullableCount,
    internationalAppearances: nullableCount,
    totalPrizeUSD: nullableCount,
  }),
  achievements: z.array(achievementSchema),
});

export interface GameAchievements {
  game: Game;
  label: string;
  summary: AchievementSummary;
  /** Newest first; entries without a date come last. */
  achievements: Achievement[];
}

/** Sort key: newest date first, undated entries last. */
function byNewest(a: Achievement, b: Achievement): number {
  const da = a.endDate ?? a.startDate;
  const db = b.endDate ?? b.startDate;
  if (da === db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return db.localeCompare(da);
}

/** Summary values present in the file win; missing ones are derived from the achievement list. */
function completeSummary(
  given: z.infer<typeof achievementFileSchema>['summary'],
  list: Achievement[],
): AchievementSummary {
  const prizeUSD = list.reduce((sum, a) => sum + (a.prize?.currency === 'USD' ? a.prize.amount : 0), 0);
  return {
    titles: given.titles ?? list.filter((a) => a.placement === '1').length,
    runnerUps: given.runnerUps ?? list.filter((a) => a.placement === '2').length,
    internationalAppearances: given.internationalAppearances ?? list.filter((a) => a.tier === 'S-Tier').length,
    totalPrizeUSD: given.totalPrizeUSD ?? Math.round(prizeUSD * 100) / 100,
  };
}

/** Validate one raw achievement file (`data/<game>_achievement.json`). */
export function buildGameAchievements(raw: unknown, file: string): GameAchievements {
  const data = parseDataFile(achievementFileSchema, raw, file);
  const achievements = [...data.achievements].sort(byNewest);
  return {
    game: data.game,
    label: GAME_LABELS[data.game],
    summary: completeSummary(data.summary, achievements),
    achievements,
  };
}

/** Totals across games, for the big numbers on the landing page. */
export function combineSummaries(games: GameAchievements[]): AchievementSummary {
  return games.reduce<AchievementSummary>(
    (total, { summary }) => ({
      titles: total.titles + summary.titles,
      runnerUps: total.runnerUps + summary.runnerUps,
      internationalAppearances: total.internationalAppearances + summary.internationalAppearances,
      totalPrizeUSD: total.totalPrizeUSD + summary.totalPrizeUSD,
    }),
    { titles: 0, runnerUps: 0, internationalAppearances: 0, totalPrizeUSD: 0 },
  );
}

/** Newest highlighted achievements across all games. */
export function latestHighlights(games: GameAchievements[], limit = 6): Achievement[] {
  return games
    .flatMap((g) => g.achievements)
    .filter((a) => a.highlight)
    .sort(byNewest)
    .slice(0, limit);
}
