# 06: Halaman Store (mode marketplace)

**What to build:** Pembeli membuka Store, melihat 85 produk, memfilter per kategori, dan menekan "Beli Sekarang" untuk membeli di Shopee.

**Blocked by:** 04

**Status:** done

- [x] Katalog produk: harga string → priceMin/priceMax, kategori dari nama, gambar dari manifest lokal, deskripsi dipecah, fallback URL Shopee/Tokopedia
- [x] Store Mode dibaca saat build; pemetaan (produk, mode) → deskriptor aksi diuji untuk kedua mode
- [x] Grid 4 kolom desktop / 2 kolom mobile, Product Card sesuai DESIGN.md
- [x] Filter kategori lewat halaman /store/kategori/<kategori> (statis, berfungsi tanpa JavaScript)
- [x] ProductAction marketplace: Beli Sekarang (Shopee, tab baru, noopener), Tokopedia, link "Belanja dari luar Indonesia?" (Shopee per negara + WhatsApp)
- [x] Tes katalog produk + E2E (filter mengubah grid & URL, link Shopee benar)
