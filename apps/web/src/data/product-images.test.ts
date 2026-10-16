import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { slugify } from '../lib/product-images.mjs';
import manifest from './product-images.json';

const products: { nama: string }[] = JSON.parse(
  readFileSync(new URL('../../../../data/alterego_produk_aktif_gambar.json', import.meta.url), 'utf-8'),
);
const publicDir = fileURLToPath(new URL('../../public', import.meta.url));

describe('product image manifest', () => {
  it('covers every active product with a unique slug', () => {
    const taken = new Set<string>();
    const slugs = products.map((p) => slugify(p.nama, taken));
    expect(Object.keys(manifest)).toEqual(slugs);
    expect(new Set(slugs).size).toBe(85);
  });

  it('gives every product at least one image in all widths, served locally', () => {
    for (const [slug, images] of Object.entries(manifest)) {
      expect(images.length, slug).toBeGreaterThan(0);
      for (const image of images) {
        expect(Object.keys(image.srcset)).toEqual(['400', '800', '1200']);
        for (const src of Object.values(image.srcset)) {
          expect(src).toMatch(/^\/products\//);
          expect(existsSync(publicDir + src), src).toBe(true);
        }
      }
    }
  });
});
