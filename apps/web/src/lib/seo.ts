// Pure helpers for the search and share metadata: which pages exist for crawlers, and how sitemap.xml reads.
// Pages under DEV_PATH_PREFIX are internal and never listed or built for production.

export const DEV_PATH_PREFIX = '/dev';

/** Pages that are always public, besides the catalog-driven ones (products, articles, categories). */
export const STATIC_PUBLIC_PATHS = ['/', '/store', '/news'] as const;

export function isDevPath(path: string): boolean {
  return path === DEV_PATH_PREFIX || path.startsWith(`${DEV_PATH_PREFIX}/`);
}

/** Unique, sorted, without internal pages. Paths must start with "/". */
export function publicSitemapPaths(paths: readonly string[]): string[] {
  const unique = new Set(paths.filter((p) => p.startsWith('/') && !isDevPath(p)));
  return [...unique].sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** sitemap.xml for the given site origin (no trailing slash) and paths. */
export function sitemapXml(origin: string, paths: readonly string[]): string {
  const base = origin.replace(/\/+$/, '');
  const urls = publicSitemapPaths(paths)
    .map((path) => `  <url><loc>${escapeXml(`${base}${path}`)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** robots.txt: crawl everything public, keep internal pages out, point at the sitemap. */
export function robotsTxt(origin: string): string {
  const base = origin.replace(/\/+$/, '');
  return ['User-agent: *', `Disallow: ${DEV_PATH_PREFIX}/`, '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n');
}
