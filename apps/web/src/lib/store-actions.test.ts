import { describe, expect, it } from 'vitest';
import { productActions } from './store-actions';

const product = { slug: 'jersey', shopeeUrl: 'https://shopee/jersey', tokopediaUrl: 'https://tokopedia/jersey' };

describe('productActions', () => {
  it('marketplace mode buys on Shopee with Tokopedia as the alternative', () => {
    const actions = productActions(product, 'marketplace');
    expect(actions.primary).toEqual({ label: 'Beli Sekarang', href: 'https://shopee/jersey', external: true });
    expect(actions.secondary.map((a) => a.label)).toEqual(['Tokopedia']);
    expect(actions.showQuantity).toBe(false);
    expect(actions.showCart).toBe(false);
  });

  it('native mode adds to cart and keeps marketplaces as secondary links', () => {
    const actions = productActions(product, 'native');
    expect(actions.primary.label).toBe('Tambah ke Keranjang');
    expect(actions.primary.external).toBe(false);
    expect(actions.secondary.map((a) => a.label)).toEqual(['Shopee', 'Tokopedia']);
    expect(actions.showQuantity).toBe(true);
    expect(actions.showCart).toBe(true);
  });
});
