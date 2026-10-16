import { describe, expect, it } from 'vitest';
import { getCategories, getLinks, getProduct, getProducts } from '.';
import { buildProducts, categorize, parsePrice, splitDescription } from './products';

describe('parsePrice', () => {
  it('reads a single Rupiah price', () => {
    expect(parsePrice('Rp585.000')).toEqual([585000, 585000]);
  });

  it('reads a price range', () => {
    expect(parsePrice('Rp325.000 - Rp335.000')).toEqual([325000, 335000]);
  });

  it('rejects text without a number', () => {
    expect(() => parsePrice('Gratis')).toThrow(/Harga tidak dikenali/);
  });
});

describe('categorize', () => {
  it.each([
    ['Alter Ego Esports Homura 26/27 Official Jersey - Home', 'jersey'],
    ['ALT390 Baseline Club Polo Jersey Relaxed Fit Polyester', 'jersey'],
    ['Alter Ego League Regalia Track Jacket - Black', 'jacket'],
    ['ALT390 Baseline Club Overshirt Textured Woven Fabric', 'jacket'],
    ['ALT390 Full Zip Hooded Vest', 'jacket'],
    ['Alter Ego X Jujutsu Kaisen Haori Kimono White', 'jacket'],
    ['Alt390 Brass Knuckle Crewneck Hitam Unisex Oversized', 'hoodie'],
    ['Alter Ego One Step Ahead Hoodie - Black', 'hoodie'],
    ['ALT390 Baseball Shirt Black V2 Reguler Fit', 'tshirt'],
    ['ALT390 Love Charcoal Ringer T-Shirt', 'tshirt'],
    ['Alter Ego League Regalia Track Pants', 'bottoms'],
    ['Alt390 Fleece Shorts Hitam Unik Elastis L-3XL', 'bottoms'],
    ['ALT390 Clubhouse Corduroy Cap Retro Adjustable', 'accessory'],
    ['Alt390 Logo Enamel Pin V3 3.5x3.5 Cm', 'accessory'],
    ['Alt390 Training Duffle Bag Durable Urban Style', 'accessory'],
  ])('%s → %s', (name, category) => {
    expect(categorize(name)).toBe(category);
  });
});

describe('splitDescription', () => {
  it('splits Shopee " | " line breaks and drops empty lines', () => {
    expect(splitDescription('Jersey | | Details: | - 100% Polyester ')).toEqual([
      'Jersey',
      'Details:',
      '- 100% Polyester',
    ]);
  });
});

describe('buildProducts', () => {
  const options = { images: {}, shopeeFallback: 'https://shopee/home', tokopediaFallback: 'https://tokopedia/home' };

  it('gives unique slugs and falls back to the store URLs', () => {
    const products = buildProducts(
      [
        { nama: 'Jersey Black', harga: 'Rp100.000', deskripsi: '', gambar: [] },
        { nama: 'Jersey Black', harga: 'Rp100.000', deskripsi: '', gambar: [] },
      ],
      'data/produk.json',
      options,
    );
    expect(products.map((p) => p.slug)).toEqual(['jersey-black', 'jersey-black-2']);
    expect(products[0]!.shopeeUrl).toBe('https://shopee/home');
    expect(products[0]!.tokopediaUrl).toBe('https://tokopedia/home');
  });

  it('names the file and entry when a price cannot be read', () => {
    expect(() =>
      buildProducts([{ nama: 'A', harga: 'Rp?', deskripsi: '', gambar: [] }], 'data/produk.json', options),
    ).toThrow(/data\/produk\.json → \[0\]\.harga/);
  });
});

describe('catalog products (real data)', () => {
  it('loads 85 products, each with local images and the Shopee store as fallback', () => {
    const products = getProducts();
    expect(products).toHaveLength(85);
    for (const p of products) {
      expect(p.images.length, p.slug).toBeGreaterThan(0);
      expect(p.shopeeUrl).toBe(getLinks().shopeeHome);
    }
    expect(getProduct(products[0]!.slug)?.name).toBe(products[0]!.name);
  });

  it('puts every product in a known category and lists only non-empty ones', () => {
    const categories = getCategories();
    expect(categories.reduce((n, c) => n + c.count, 0)).toBe(85);
    expect(categories.find((c) => c.category === 'other')).toBeUndefined();
  });
});
