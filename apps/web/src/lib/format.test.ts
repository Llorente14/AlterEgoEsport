import { describe, expect, it } from 'vitest';
import { formatPriceRange } from './format';

const normalize = (s: string) => s.replace(/\s/g, ' ');

describe('formatPriceRange', () => {
  it('formats a single price in Rupiah', () => {
    expect(normalize(formatPriceRange(585000))).toBe('Rp 585.000');
  });

  it('formats a price range', () => {
    expect(normalize(formatPriceRange(325000, 335000))).toBe('Rp 325.000 – Rp 335.000');
  });
});
