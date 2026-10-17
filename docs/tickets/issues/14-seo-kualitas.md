# 14: SEO & kualitas

**What to build:** Situs mudah ditemukan dan dibagikan, cepat, dan aksesibel.

**Blocked by:** 07, 09, 10, 11, 12, 13

**Status:** done

- [x] Meta title/description per halaman, OG image produk & artikel, sitemap.xml, robots.txt
- [x] Halaman 404 bergaya brand
- [x] Halaman uji aset dikeluarkan dari build produksi / sitemap
- [x] Lighthouse mobile: Performance > 80, Accessibility > 90, SEO > 90 (Landing, Store, Produk, Artikel)

**Catatan implementasi (2026-10-17):**
- OG image produk = foto produk pertama (800 px); artikel = cover artikel; halaman lain = logo 1200 px.
  Belum ada gambar OG khusus 1200×630 untuk landing/store.
- `/dev/*` dikeluarkan dari `dist` oleh integrasi di `astro.config.mjs`; e2e membangun dengan `INCLUDE_DEV_PAGES=1`.
- Lighthouse 12, mobile, build produksi: landing 92/100/100, store 100/98/100, produk 98/100/100, berita 95/100/100
  (Performance/Accessibility/SEO).
- Domain di `astro.config.mjs` masih placeholder `alterego.example`; diganti di tiket 15.
