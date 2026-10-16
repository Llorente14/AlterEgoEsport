const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

/** Format a price (or price range) in Rupiah, e.g. "Rp 585.000" or "Rp 325.000 – Rp 335.000". */
export function formatPriceRange(min: number, max: number = min): string {
  return min === max ? idr.format(min) : `${idr.format(min)} – ${idr.format(max)}`;
}

const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
  trailingZeroDisplay: 'stripIfInteger',
});

/** Compact US dollars for big stats, e.g. "$1.1M" or "$436.1K". */
export function formatUSDCompact(amount: number): string {
  return usdCompact.format(amount);
}

const monthYear = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "2026-01-25" → "JAN 2026"; null when the date is unknown. */
export function formatMonthYear(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const date = new Date(isoDate.length === 7 ? `${isoDate}-01` : isoDate);
  return Number.isNaN(date.getTime()) ? null : monthYear.format(date).replace('.', '').toUpperCase();
}
