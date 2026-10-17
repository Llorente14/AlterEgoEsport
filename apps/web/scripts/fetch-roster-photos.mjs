// Downloads roster profile images (the `profileImg` URLs in data/<game>.json) once and writes optimized WebP
// copies (400/800 wide, never upscaled) plus a manifest: "<game>:<player id>" → local image set.
// The site then serves every player photo itself instead of hotlinking. Idempotent: cached originals and
// existing WebP outputs are reused. Re-run after `profileImg` changes in the data files.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WEB_ROOT = fileURLToPath(new URL('..', import.meta.url));
const WORKSPACE_ROOT = join(WEB_ROOT, '..', '..');
const DATA_DIR = join(WORKSPACE_ROOT, 'data');
const CACHE_DIR = join(WORKSPACE_ROOT, '.cache', 'roster-originals');
const OUT_DIR = join(WEB_ROOT, 'public', 'roster');
const MANIFEST = join(WEB_ROOT, 'src', 'data', 'roster-photos.json');
const GAMES = ['mlbb', 'cs2', 'pubgm'];
const WIDTHS = [400, 800];
const USER_AGENT = 'AlterEgoWeb-build/1.0 (one-time asset fetch)';

/** @param {string} url @param {string} dest */
async function download(url, dest) {
  if (existsSync(dest)) return false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      return true;
    }
    if (attempt === 3) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
  return false;
}

async function main() {
  mkdirSync(CACHE_DIR, { recursive: true });
  /** @type {Record<string, { width: number; height: number; srcset: Record<string, string> }>} */
  const manifest = {};
  const failures = [];
  let downloaded = 0;
  let encoded = 0;

  for (const game of GAMES) {
    const file = JSON.parse(readFileSync(join(DATA_DIR, `${game}.json`), 'utf-8'));
    for (const player of file.players) {
      if (!player.profileImg) continue;
      const key = `${game}:${player.id}`;
      const original = join(CACHE_DIR, `${game}-${player.id}.img`);
      try {
        if (await download(player.profileImg, original)) downloaded++;
        const meta = await sharp(original).metadata();
        const srcset = {};
        for (const width of WIDTHS) {
          const name = `${player.id}-${width}.webp`;
          const dest = join(OUT_DIR, game, name);
          srcset[width] = `/roster/${game}/${name}`;
          if (existsSync(dest)) continue;
          mkdirSync(dirname(dest), { recursive: true });
          await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
          encoded++;
        }
        manifest[key] = { width: meta.width ?? 1, height: meta.height ?? 1, srcset };
      } catch (err) {
        failures.push(`${key}: ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `fetch-roster-photos: ${Object.keys(manifest).length} foto (${downloaded} diunduh, ${encoded} WebP baru)`,
  );
  if (failures.length > 0) {
    console.error('Gagal:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

await main();
