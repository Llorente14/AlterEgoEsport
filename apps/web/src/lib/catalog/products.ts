import type { Product, ProductCategory } from '@alterego/shared';
import { z } from 'zod';
import { slugify } from '../product-images.mjs';
import { parseDataFile } from './validate';

const rawProductSchema = z.object({
  nama: z.string().min(1),
  harga: z.string().min(1),
  deskripsi: z.string(),
  gambar: z.array(z.string()),
});

const productFileSchema = z.array(rawProductSchema);

export interface ProductImage {
  width: number;
  height: number;
  /** Width (400/800/1200) → local WebP path. */
  srcset: Record<string, string>;
}

/** Product as shown on the site; images are local optimized copies. */
export interface StoreProduct extends Omit<Product, 'images'> {
  images: ProductImage[];
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  jersey: 'Jersey',
  jacket: 'Jaket',
  hoodie: 'Hoodie & Crewneck',
  tshirt: 'Kaos & Kemeja',
  bottoms: 'Celana',
  accessory: 'Aksesori',
  other: 'Lainnya',
};

// First match wins, so specific garments come before generic words (e.g. "Overshirt" is a jacket, not a shirt).
const CATEGORY_RULES: [ProductCategory, RegExp][] = [
  ['accessory', /\b(keychain|lanyard|pin|mug|tumbler|tote|bag|backpack|flag|cap|snapback|gift card|duffle)\b/],
  ['bottoms', /\b(pants|shorts|sweatpants)\b/],
  ['jersey', /\bjersey\b/],
  ['jacket', /\b(jacket|tracktop|bomber|windbreaker|overshirt|vest|haori|kimono|flannel|sherpa)\b/],
  ['hoodie', /\b(hoodie|crewneck|halfzip|half zip)\b/],
  ['tshirt', /\b(t-shirt|tshirt|shirt|kemeja|ringer|basic series)\b/],
];

export function categorize(name: string): ProductCategory {
  const lower = name.toLowerCase();
  return CATEGORY_RULES.find(([, pattern]) => pattern.test(lower))?.[0] ?? 'other';
}

/** "Rp585.000" → [585000, 585000]; "Rp325.000 - Rp335.000" → [325000, 335000]. */
export function parsePrice(raw: string): [number, number] {
  const amounts = (raw.match(/\d[\d.]*/g) ?? []).map((part) => Number(part.replace(/\./g, '')));
  if (amounts.length === 0 || amounts.some(Number.isNaN)) throw new Error(`Harga tidak dikenali: "${raw}"`);
  return [Math.min(...amounts), Math.max(...amounts)];
}

/** Shopee descriptions use " | " as line breaks. */
export function splitDescription(raw: string): string[] {
  return raw
    .split('|')
    .map((line) => line.trim())
    .filter(Boolean);
}

interface BuildOptions {
  images: Record<string, ProductImage[]>;
  shopeeFallback: string;
  tokopediaFallback: string;
}

export function buildProducts(raw: unknown, file: string, options: BuildOptions): StoreProduct[] {
  const data = parseDataFile(productFileSchema, raw, file);
  const taken = new Set<string>();

  return data.map((item, index) => {
    const slug = slugify(item.nama, taken);
    let priceMin: number;
    let priceMax: number;
    try {
      [priceMin, priceMax] = parsePrice(item.harga);
    } catch (error) {
      throw new Error(`${file} → [${index}].harga: ${(error as Error).message}`);
    }
    return {
      slug,
      name: item.nama,
      category: categorize(item.nama),
      priceMin,
      priceMax,
      images: options.images[slug] ?? [],
      descriptionBlocks: splitDescription(item.deskripsi),
      shopeeUrl: options.shopeeFallback,
      tokopediaUrl: options.tokopediaFallback,
    };
  });
}
