import { describe, expect, it } from 'vitest';
import { isDevPath, publicSitemapPaths, robotsTxt, sitemapXml } from './seo';

describe('isDevPath', () => {
  it('flags the internal pages only', () => {
    expect(isDevPath('/dev')).toBe(true);
    expect(isDevPath('/dev/assets')).toBe(true);
    expect(isDevPath('/developer')).toBe(false);
    expect(isDevPath('/store')).toBe(false);
  });
});

describe('publicSitemapPaths', () => {
  it('drops internal pages and duplicates, puts home first, sorts the rest', () => {
    expect(publicSitemapPaths(['/store/b', '/dev/assets', '/', '/news', '/store/a', '/news', 'x'])).toEqual([
      '/',
      '/news',
      '/store/a',
      '/store/b',
    ]);
  });
});

describe('sitemapXml', () => {
  it('lists absolute URLs and escapes XML characters', () => {
    const xml = sitemapXml('https://example.com/', ['/', '/store/a&b', '/dev/assets']);
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/store/a&amp;b</loc>');
    expect(xml).not.toContain('/dev/');
    expect(xml.startsWith('<?xml')).toBe(true);
  });
});

describe('robotsTxt', () => {
  it('blocks dev pages and names the sitemap', () => {
    const txt = robotsTxt('https://example.com');
    expect(txt).toContain('Disallow: /dev/');
    expect(txt).toContain('Sitemap: https://example.com/sitemap.xml');
  });
});
