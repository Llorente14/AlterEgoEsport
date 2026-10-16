import type { StoreMode } from '@alterego/shared';

export interface ActionLink {
  label: string;
  href: string;
  external: boolean;
}

/** What the buy area of a product shows, independent of layout. */
export interface ProductActions {
  primary: ActionLink;
  secondary: ActionLink[];
  /** Show the quantity stepper and the cart icon (native checkout only). */
  showQuantity: boolean;
  showCart: boolean;
}

interface ActionInput {
  slug: string;
  shopeeUrl: string;
  tokopediaUrl: string;
}

/** Map a product and the store mode to the buttons it shows. */
export function productActions(product: ActionInput, mode: StoreMode): ProductActions {
  const shopee = { label: 'Shopee', href: product.shopeeUrl, external: true };
  const tokopedia = { label: 'Tokopedia', href: product.tokopediaUrl, external: true };

  if (mode === 'native') {
    return {
      primary: { label: 'Tambah ke Keranjang', href: `/store/${product.slug}#beli`, external: false },
      secondary: [shopee, tokopedia],
      showQuantity: true,
      showCart: true,
    };
  }

  return {
    primary: { label: 'Beli Sekarang', href: product.shopeeUrl, external: true },
    secondary: [tokopedia],
    showQuantity: false,
    showCart: false,
  };
}
