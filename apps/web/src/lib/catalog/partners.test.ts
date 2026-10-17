import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getLinks, getPartners } from '.';
import { buildPartners } from './partners';

const publicDir = fileURLToPath(new URL('../../../public', import.meta.url));

describe('buildPartners', () => {
  it('turns logo file names into public URLs and keeps wordmark partners', () => {
    expect(
      buildPartners(
        { partners: [{ name: 'A', logo: 'a.png', width: 100, height: 40 }, { name: 'B', logo: null }] },
        'data/partners.json',
      ),
    ).toEqual([
      { name: 'A', logoSrc: '/partners/a.png', width: 100, height: 40, scale: 1 },
      { name: 'B', logoSrc: null, scale: 1 },
    ]);
  });

  it('reads an optional display scale and rejects out-of-range values', () => {
    const [p] = buildPartners(
      { partners: [{ name: 'A', logo: 'a.png', width: 10, height: 10, scale: 1.5 }] },
      'data/partners.json',
    );
    expect(p!.scale).toBe(1.5);
    expect(() =>
      buildPartners({ partners: [{ name: 'A', logo: null, scale: 3 }] }, 'data/partners.json'),
    ).toThrow(/partners\[0\]\.scale/);
  });

  it('requires a size for logos', () => {
    expect(() => buildPartners({ partners: [{ name: 'A', logo: 'a.png' }] }, 'data/partners.json')).toThrow(
      /partners\[0\]\.logo: Logo wajib punya width dan height/,
    );
  });

  it('rejects logo paths that are not plain image file names', () => {
    expect(() =>
      buildPartners({ partners: [{ name: 'A', logo: '../secret.txt', width: 1, height: 1 }] }, 'data/partners.json'),
    ).toThrow(/data\/partners\.json → partners\[0\]\.logo/);
  });
});

describe('catalog partners and links (real data)', () => {
  it('lists the seven partners and every logo file exists', () => {
    const partners = getPartners();
    expect(partners.map((p) => p.name)).toEqual([
      'Good Day Coffee',
      'GoPay',
      'Interbat',
      'CBN Fiber',
      'myBCA',
      'Supreme League',
      'Interlac',
    ]);
    for (const p of partners) {
      if (p.logoSrc) expect(existsSync(publicDir + p.logoSrc), p.logoSrc).toBe(true);
    }
  });

  it('has both social groups and the Indonesian Shopee store as home', () => {
    const links = getLinks();
    expect(links.social['alterego-esports'].map((s) => s.platform)).toEqual(['Instagram', 'TikTok', 'YouTube', 'X']);
    expect(links.social['alter-merch']).toHaveLength(1);
    expect(links.shopeeHome).toBe('https://shopee.co.id/alterego_merch');
    expect(links.shopee).toHaveLength(6);
  });
});
