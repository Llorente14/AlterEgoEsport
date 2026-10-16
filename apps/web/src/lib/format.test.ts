import { describe, expect, it } from 'vitest';
import { formatMonthYear, formatPriceRange, formatUSDCompact } from './format';

const normalize = (s: string) => s.replace(/\s/g, ' ');

describe('formatPriceRange', () => {
  it('formats a single price in Rupiah', () => {
    expect(normalize(formatPriceRange(585000))).toBe('Rp 585.000');
  });

  it('formats a price range', () => {
    expect(normalize(formatPriceRange(325000, 335000))).toBe('Rp 325.000 – Rp 335.000');
  });
});

describe('formatUSDCompact', () => {
  it('abbreviates large dollar amounts', () => {
    expect(formatUSDCompact(1_099_782.47)).toBe('$1.1M');
    expect(formatUSDCompact(436_143.47)).toBe('$436.1K');
    expect(formatUSDCompact(23_000)).toBe('$23K');
    expect(formatUSDCompact(500)).toBe('$500');
  });
});

describe('formatMonthYear', () => {
  it('formats ISO dates and year-months in Indonesian', () => {
    expect(formatMonthYear('2026-01-25')).toBe('JAN 2026');
    expect(formatMonthYear('2025-08')).toBe('AGU 2025');
  });

  it('returns null for unknown dates', () => {
    expect(formatMonthYear(null)).toBeNull();
  });
});
