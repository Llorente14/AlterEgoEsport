// Converts the founder portraits in data/ceo_photo/ to WebP in public/founders/ (max 800 px wide, never
// upscaled). The file name stays the id: delwyn_sukamto_2.jpg → /founders/delwyn-sukamto-2.webp.
// Idempotent: existing outputs are reused.
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WEB_ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_DIR = join(WEB_ROOT, '..', '..', 'data', 'ceo_photo');
const OUT_DIR = join(WEB_ROOT, 'public', 'founders');

mkdirSync(OUT_DIR, { recursive: true });
let encoded = 0;
const files = readdirSync(SOURCE_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
for (const file of files) {
  const name = basename(file, extname(file)).toLowerCase().replace(/_/g, '-');
  const dest = join(OUT_DIR, `${name}.webp`);
  if (existsSync(dest)) continue;
  await sharp(join(SOURCE_DIR, file)).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
  encoded++;
}
console.log(`optimize-founder-photos: ${files.length} foto (${encoded} WebP baru)`);
