import { describe, expect, it } from 'vitest';
import { originalImageUrls, slugify } from './product-images.mjs';

const CDN = 'https://down-id.img.susercontent.com/file';

describe('slugify', () => {
  it('builds a URL-safe slug from a product name', () => {
    expect(slugify('Alter Ego Esports Homura 26/27 Official Jersey - Home')).toBe(
      'alter-ego-esports-homura-26-27-official-jersey-home',
    );
  });

  it('keeps slugs unique within a set', () => {
    const taken = new Set<string>();
    expect(slugify('Jersey Black', taken)).toBe('jersey-black');
    expect(slugify('Jersey  Black!', taken)).toBe('jersey-black-2');
  });
});

describe('originalImageUrls', () => {
  it('drops the listing thumbnail and size variants, keeping gallery order', () => {
    expect(
      originalImageUrls([
        `${CDN}/ef1c98a2_tn`,
        `${CDN}/sg-1-aaa@resize_w900_nl.webp`,
        `${CDN}/sg-1-bbb@resize_w164_nl.webp`,
        `${CDN}/sg-1-aaa@resize_w164_nl.webp`,
      ]),
    ).toEqual([`${CDN}/sg-1-aaa`, `${CDN}/sg-1-bbb`]);
  });

  it('falls back to the thumbnail when it is the only image', () => {
    expect(originalImageUrls([`${CDN}/ef1c98a2_tn`])).toEqual([`${CDN}/ef1c98a2`]);
  });
});
