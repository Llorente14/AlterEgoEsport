// Downloads product images from the Shopee CDN once and writes optimized WebP copies
// (400/800/1200 wide, never upscaled) plus a manifest: product slug → local image sets.
// Idempotent: cached originals and existing WebP outputs are reused.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { originalImageUrls, shopeeFileId, slugify } from '../src/lib/product-images.mjs';

const WEB_ROOT = fileURLToPath(new URL('..', import.meta.url));
const WORKSPACE_ROOT = join(WEB_ROOT, '..', '..');
const SOURCE = join(WORKSPACE_ROOT, 'data', 'alterego_produk_aktif_gambar.json');
const CACHE_DIR = join(WORKSPACE_ROOT, '.cache', 'product-originals');
const OUT_DIR = join(WEB_ROOT, 'public', 'products');
const MANIFEST = join(WEB_ROOT, 'src', 'data', 'product-images.json');
const WIDTHS = [400, 800, 1200];
const CONCURRENCY = 6;

/** @param {string} url @param {string} dest */
async function download(url, dest) {
  if (existsSync(dest)) return false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url);
    if (res.ok) {
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      return true;
    }
    if (attempt === 3) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    await new Promise((r) => setTimeout(r, 500 * attempt));
  }
  return false;
}

/** @template T @param {T[]} items @param {(item: T) => Promise<void>} worker */
async function pool(items, worker) {
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) await worker(items[next++]);
    }),
  );
}

async function main() {
  mkdirSync(CACHE_DIR, { recursive: true });
  /** @type {{ nama: string; gambar: string[] }[]} */
  const products = JSON.parse(readFileSync(SOURCE, 'utf-8'));
  const taken = new Set();

  const jobs = products.map((p) => ({
    slug: slugify(p.nama, taken),
    urls: originalImageUrls(p.gambar),
  }));

  /** @type {Record<string, { width: number; height: number; srcset: Record<string, string> }[]>} */
  const manifest = {};
  let downloaded = 0;
  let encoded = 0;
  const failures = [];

  await pool(jobs, async ({ slug, urls }) => {
    const images = [];
    for (const [i, url] of urls.entries()) {
      const original = join(CACHE_DIR, `${shopeeFileId(url)}.img`);
      try {
        if (await download(url, original)) downloaded++;
        const meta = await sharp(original).metadata();
        const srcset = {};
        for (const width of WIDTHS) {
          const name = `${String(i + 1).padStart(2, '0')}-${width}.webp`;
          const dest = join(OUT_DIR, slug, name);
          srcset[width] = `/products/${slug}/${name}`;
          if (existsSync(dest)) continue;
          mkdirSync(dirname(dest), { recursive: true });
          await sharp(original)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(dest);
          encoded++;
        }
        const w = meta.width ?? 1;
        const h = meta.height ?? 1;
        images.push({ width: w, height: h, srcset });
      } catch (err) {
        failures.push(`${slug} #${i + 1}: ${err instanceof Error ? err.message : err}`);
      }
    }
    manifest[slug] = images;
  });

  const ordered = Object.fromEntries(jobs.map(({ slug }) => [slug, manifest[slug]]));
  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(ordered, null, 2) + '\n');

  const imageCount = Object.values(ordered).reduce((n, list) => n + list.length, 0);
  console.log(
    `fetch-product-images: ${jobs.length} produk, ${imageCount} gambar ` +
      `(${downloaded} diunduh, ${encoded} WebP baru)`,
  );
  if (failures.length > 0) {
    console.error('Gagal:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

await main();
