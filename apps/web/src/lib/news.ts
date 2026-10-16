export const NEWS_CATEGORIES = ['MATCH', 'RESULT', 'MERCH', 'ROSTER'] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  MATCH: 'Match',
  RESULT: 'Result',
  MERCH: 'Merch',
  ROSTER: 'Roster',
};

interface Dated {
  id: string;
  data: { date: Date; category: NewsCategory };
}

/** Newest first; ties keep a stable order by id. */
export function sortNews<T extends Dated>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

/** Other articles to read next: same category first, then the newest of the rest. */
export function relatedNews<T extends Dated>(entries: T[], current: T, limit = 3): T[] {
  const others = sortNews(entries.filter((e) => e.id !== current.id));
  const same = others.filter((e) => e.data.category === current.data.category);
  const rest = others.filter((e) => e.data.category !== current.data.category);
  return [...same, ...rest].slice(0, limit);
}

const fullDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "16 OKT 2026" */
export function formatNewsDate(date: Date): string {
  return fullDate.format(date).replace('.', '').toUpperCase();
}
