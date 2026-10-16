import { describe, expect, it } from 'vitest';
import { getProducts } from './catalog';
import { groupDescription } from './product-description';

describe('groupDescription', () => {
  it('splits a Shopee description into titled sections', () => {
    expect(
      groupDescription([
        'Alter Ego Esports Homura 26/27 Jersey',
        'Every season begins with a new challenge.',
        'Details:',
        '- 100% Polyester',
        '- Regular Fit',
        'Size Charts (Regular Fit in cm); / Chest / Length',
        'XS / 48 / 56',
        'Our Packaging Details:',
        '- Collectible Hardbox',
        'Notes:',
        '- Warna dapat berbeda sedikit',
      ]),
    ).toEqual([
      {
        title: 'Deskripsi',
        lines: ['Alter Ego Esports Homura 26/27 Jersey', 'Every season begins with a new challenge.'],
      },
      { title: 'Detail', lines: ['- 100% Polyester', '- Regular Fit'] },
      { title: 'Size Chart', lines: ['(Regular Fit in cm); / Chest / Length', 'XS / 48 / 56'] },
      { title: 'Isi Paket', lines: ['- Collectible Hardbox'] },
      { title: 'Catatan', lines: ['- Warna dapat berbeda sedikit'] },
    ]);
  });

  it('keeps "label: value" lines and size chart sentences as content', () => {
    expect(
      groupDescription(['Tote bag kanvas', 'Bahan: Canvas Twill', 'Size chart di slide terakhir']),
    ).toEqual([
      { title: 'Deskripsi', lines: ['Tote bag kanvas', 'Bahan: Canvas Twill', 'Size chart di slide terakhir'] },
    ]);
  });

  it('drops empty sections and keeps custom headings', () => {
    expect(groupDescription(['Note:', 'Syarat dan Ketentuan Custom Nameset:', '- Maks 15 karakter'])).toEqual([
      { title: 'Syarat dan Ketentuan Custom Nameset', lines: ['- Maks 15 karakter'] },
    ]);
  });

  it('gives every real product at least one section', () => {
    for (const product of getProducts()) {
      expect(groupDescription(product.descriptionBlocks).length, product.slug).toBeGreaterThan(0);
    }
  });
});
