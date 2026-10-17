import { describe, expect, it } from 'vitest';
import { classify, collectExternalUrls } from './check-links.mjs';

const links = {
  shopee: [{ country: 'ID', label: 'Shopee Indonesia', url: 'https://shopee.co.id/alterego_merch' }],
  tokopedia: { label: 'Tokopedia', url: 'https://www.tokopedia.com/alteregomerch' },
  whatsapp: { label: 'WhatsApp', url: 'https://wa.me/6289652442519' },
  offlineStore: { name: 'Milestones Coffee', area: 'Jakarta Barat', mapsUrl: 'https://maps.google.com/?q=x' },
  social: {
    'alterego-esports': [{ platform: 'Instagram', handle: '@a', url: 'https://www.instagram.com/a/' }],
    'alter-merch': [{ platform: 'Instagram', handle: '@m', url: 'https://www.instagram.com/a/' }],
  },
  linktree: 'https://linktr.ee/x',
};

describe('collectExternalUrls', () => {
  it('collects every external link once, with a readable label', () => {
    const urls = collectExternalUrls(links);
    expect(urls.map((u) => u.url)).toEqual([
      'https://shopee.co.id/alterego_merch',
      'https://www.tokopedia.com/alteregomerch',
      'https://wa.me/6289652442519',
      'https://maps.google.com/?q=x',
      'https://www.instagram.com/a/',
      'https://linktr.ee/x',
    ]);
    expect(urls[0]).toEqual({ label: 'Shopee Indonesia', url: 'https://shopee.co.id/alterego_merch' });
  });

  it('rejects links that are not absolute http(s) URLs', () => {
    expect(() =>
      collectExternalUrls({ ...links, linktree: 'linktr.ee/x' }),
    ).toThrow(/Linktree/);
  });
});

describe('classify', () => {
  it('treats success and redirects as ok', () => {
    expect(classify({ status: 200 })).toBe('ok');
    expect(classify({ status: 301 })).toBe('ok');
  });

  it('treats anti-bot answers as blocked, not broken', () => {
    expect(classify({ status: 403 })).toBe('blocked');
    expect(classify({ status: 429 })).toBe('blocked');
    expect(classify({ status: 999 })).toBe('blocked');
  });

  it('treats missing pages, server errors and network failures as broken', () => {
    expect(classify({ status: 404 })).toBe('broken');
    expect(classify({ status: 410 })).toBe('broken');
    expect(classify({ status: 503 })).toBe('broken');
    expect(classify({ error: 'getaddrinfo ENOTFOUND' })).toBe('broken');
    expect(classify({ error: 'The operation was aborted due to timeout' })).toBe('broken');
  });
});
