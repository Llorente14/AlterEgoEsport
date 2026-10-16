// Pure helpers shared by the product image pipeline and (Fase 1) the catalog.

/**
 * URL-safe slug from a product name. Unique across a set when `taken` is given.
 * @param {string} name
 * @param {Set<string>} [taken]
 */
export function slugify(name, taken) {
  const base =
    name
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .replace(/-+$/g, '') || 'produk';
  if (!taken) return base;
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  taken.add(slug);
  return slug;
}

/**
 * Shopee CDN file id from an image URL: strips size variants like `_tn` and `@resize_w164_nl.webp`.
 * @param {string} url
 */
export function shopeeFileId(url) {
  const file = url.split('/file/').pop() ?? url;
  return file.replace(/@.*$/, '').replace(/_tn$/, '');
}

/**
 * Original-resolution source URLs for a product: one per distinct file id, in gallery order.
 * The `_tn` listing thumbnail is only kept when the product has no other images.
 * @param {string[]} urls
 * @returns {string[]}
 */
export function originalImageUrls(urls) {
  const gallery = urls.filter((u) => !/_tn$/.test(u));
  const chosen = gallery.length > 0 ? gallery : urls;
  const seen = new Set();
  const result = [];
  for (const url of chosen) {
    const id = shopeeFileId(url);
    if (seen.has(id)) continue;
    seen.add(id);
    const origin = url.split('/file/')[0];
    result.push(`${origin}/file/${id}`);
  }
  return result;
}
