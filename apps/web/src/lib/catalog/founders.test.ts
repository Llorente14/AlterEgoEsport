import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getFounders } from '.';
import { buildFounders } from './founders';

const founder = (overrides: Record<string, unknown> = {}) => ({
  id: 'a',
  name: 'Delwyn Sukamto',
  role: 'CEO & Founder Alter Ego',
  photo: null,
  ...overrides,
});

describe('buildFounders', () => {
  it('keeps the order of the data file', () => {
    const result = buildFounders({ founders: [founder({ id: 'a' }), founder({ id: 'b' })] }, 'data/founders.json');
    expect(result.map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('names the file and entry when a name is missing', () => {
    expect(() => buildFounders({ founders: [founder({ name: '' })] }, 'data/founders.json')).toThrow(
      /data\/founders\.json → founders\[0\]\.name/,
    );
  });

  it('rejects duplicate ids', () => {
    expect(() => buildFounders({ founders: [founder(), founder()] }, 'data/founders.json')).toThrow(
      /founders\[1\]\.id: id "a" dipakai dua kali/,
    );
  });
});

describe('getFounders (real data)', () => {
  it('has five cards for Delwyn Sukamto, founder of Alter Ego, each with a local photo', () => {
    const founders = getFounders();
    expect(founders).toHaveLength(5);
    const publicDir = fileURLToPath(new URL('../../../public', import.meta.url));
    for (const f of founders) {
      expect(f).toMatchObject({ name: 'Delwyn Sukamto', role: 'CEO & Founder Alter Ego' });
      expect(f.photo, f.id).toMatch(/^\/founders\/.+\.webp$/);
      expect(existsSync(`${publicDir}${f.photo}`), f.photo!).toBe(true);
    }
  });
});
