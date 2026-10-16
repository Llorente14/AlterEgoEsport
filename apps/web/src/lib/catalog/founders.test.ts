import { describe, expect, it } from 'vitest';
import { getFounders } from '.';
import { buildFounders } from './founders';

const founder = (overrides: Record<string, unknown> = {}) => ({
  id: 'a',
  name: 'Delwyn Sukamto',
  role: 'Founder Alter Ego',
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
  it('has five placeholder cards for Delwyn Sukamto, founder of Alter Ego', () => {
    const founders = getFounders();
    expect(founders).toHaveLength(5);
    for (const f of founders) {
      expect(f).toMatchObject({ name: 'Delwyn Sukamto', role: 'Founder Alter Ego', photo: null });
    }
  });
});
