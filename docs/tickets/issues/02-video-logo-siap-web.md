# 02: Video dan logo siap web

**What to build:** Showreel dan logo 3D bisa dimuat di situs dalam ukuran ramah web; halaman uji internal memutar showreel dan menampilkan logo. Build gagal bila aset melebihi batas ukuran.

**Blocked by:** 01

**Status:** done

- [x] Showreel MP4 (H.264) dan WebM ≤ 8 MB masing-masing, 720p; versi 480p untuk mobile; poster WebP
- [x] Logo 3D optimized (≤ 3 MB) dan logo 2D WebP/PNG tersedia sebagai aset situs
- [x] Skrip cek ukuran aset dijalankan sebelum build dan gagal bila batas dilanggar
- [x] Halaman uji internal (tidak masuk sitemap) memutar showreel muted loop playsinline + menampilkan logo 2D
- [x] E2E: halaman uji memuat video dengan sumber yang valid
