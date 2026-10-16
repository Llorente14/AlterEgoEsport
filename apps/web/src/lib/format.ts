const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

/** Format a price (or price range) in Rupiah, e.g. "Rp 585.000" or "Rp 325.000 – Rp 335.000". */
export function formatPriceRange(min: number, max: number = min): string {
  return min === max ? idr.format(min) : `${idr.format(min)} – ${idr.format(max)}`;
}
