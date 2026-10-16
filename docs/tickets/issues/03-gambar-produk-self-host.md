# 03: Gambar produk disimpan sendiri

**What to build:** Seluruh 85 produk aktif punya gambar lokal teroptimasi sehingga situs tidak hotlink ke CDN Shopee.

**Blocked by:** 01

**Status:** done

- [x] Skrip mengunduh gambar dari data produk, membuang duplikat ukuran (_tn, resize_w164, dll.), menyimpan resolusi tertinggi
- [x] Setiap gambar dibuat WebP lebar 400/800/1200
- [x] Manifest memetakan produk (slug) → daftar file lokal
- [x] Skrip idempoten: dijalankan ulang tidak mengunduh ulang file yang sudah ada
- [x] Tes: manifest berisi 85 produk, tiap produk ≥ 1 gambar, slug unik
