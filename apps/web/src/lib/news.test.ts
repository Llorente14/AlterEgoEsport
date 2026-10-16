import { describe, expect, it } from 'vitest';
import { formatNewsDate, relatedNews, sortNews, type NewsCategory } from './news';

const article = (id: string, date: string, category: NewsCategory = 'RESULT') => ({
  id,
  data: { date: new Date(date), category },
});

describe('sortNews', () => {
  it('puts the newest article first', () => {
    const sorted = sortNews([article('a', '2025-12-07'), article('b', '2026-08-30'), article('c', '2026-01-25')]);
    expect(sorted.map((a) => a.id)).toEqual(['b', 'c', 'a']);
  });
});

describe('relatedNews', () => {
  it('prefers the same category, excludes the current article and limits the count', () => {
    const current = article('current', '2026-01-01', 'RESULT');
    const list = [
      current,
      article('merch-new', '2026-09-01', 'MERCH'),
      article('result-old', '2025-01-01', 'RESULT'),
      article('result-new', '2026-02-01', 'RESULT'),
      article('roster', '2026-03-01', 'ROSTER'),
    ];
    expect(relatedNews(list, current).map((a) => a.id)).toEqual(['result-new', 'result-old', 'merch-new']);
  });
});

describe('formatNewsDate', () => {
  it('formats dates in Indonesian upper case', () => {
    expect(formatNewsDate(new Date('2026-10-16'))).toBe('16 OKT 2026');
  });
});
