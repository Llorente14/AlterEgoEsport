# Handoff — status terakhir

> Perbarui file ini di akhir setiap sesi (bagian "Status" dan "Berikutnya"). Terakhir: 2026-10-17.

## Status
- Fase 0–5 (SPEC-MVP) hampir selesai: tiket 02–14 dan 16 **done**; 01 menunggu deploy Vercel oleh Axel;
  15 (rilis produksi) **belum** (menunggu domain produksi).
- Halaman: `/` (landing), `/store`, `/store/kategori/<k>`, `/store/<slug>` (85 produk), `/news`, `/news/<slug>`,
  `/dev/assets` (halaman uji, dikeluarkan dari produksi di tiket 14).
- Urutan landing: Hero (video latar 30%) → Story (3 scene + Founder) → Roster → Alter Merch → Achievements →
  News → Partners → Join → Footer.
- Store mode: `marketplace` (tombol Beli Sekarang → Shopee, fallback ke toko). Checkout native = Fase 6.
- Tes terakhir (2026-10-17): unit lolos, `astro check` 0 error, **E2E 80 lolos / 17 skip** (termasuk
  `tests/e2e/logo3d.spec.ts` di proyek `desktop-3d`: kanvas + `data-logo3d="ready"`, kursor → `data-yaw`,
  ikut-kursor memudar di tengah flip, fallback 2D saat glb diblokir, mobile tidak mengunduh glb/chunk `logo3d`).
- Tes 3D sengaja berjalan berurutan (`describe.configure({ mode: 'default' })`): tiga render WebGL software
  paralel saling memperlambat sampai timeout.
- `mountLogo3D` kini melepas konteks WebGL + menghapus kanvas bila model gagal dimuat.
- Tiket 14 selesai: `lib/seo.ts` (sitemap, robots, uji unit), `BaseLayout` punya canonical + OG + Twitter card
  (prop `image`, `type`, `noindex`), halaman produk/artikel mengirim gambar sendiri, `src/pages/404.astro`
  bergaya brand, `/dev/*` tidak masuk `dist` (integrasi di `astro.config.mjs`; e2e pakai `INCLUDE_DEV_PAGES=1`).
  Tes: unit 95/95, e2e 92 lolos / 17 skip, `astro check` 0.
- 14 produk (ACFC Jogo Bonito ×2, Alt390 pants/vest/flannel/pin/panik/sherpa/hoodie, keychain 3D, haori white,
  tote bag) hanya punya 1 foto: foto 164 px kecil dihapus dari `data/alterego_produk_aktif_gambar.json`
  (manifest + file WebP ikut dibersihkan). Kartu dengan satu foto: hover = zoom, bukan ganti foto.
- Roster: tab sekarang 4 — Mobile Legends MPL, Mobile Legends MDL, Counter-Strike 2, PUBG Mobile. Game yang
  divisinya main di liga berbeda (dibaca dari `gameSpecific.league`) dipecah per divisi (`buildRosterTabs`);
  hash tab jadi `#roster-mlbb-mpl`, `#roster-mlbb-mdl`, `#roster-cs2`, `#roster-pubgm`.
- Semua gambar kini self-host (tidak ada hotlink di `dist`). Foto roster: `npm run fetch:photos` mengunduh
  `profileImg` dari `data/<game>.json` sekali, membuat WebP 400/800 di `public/roster/<game>/` + manifest
  `src/data/roster-photos.json` (kunci `game:id`). Jalankan ulang bila `profileImg` berubah; tes unit gagal
  jika ada `profileImg` tanpa salinan lokal. Foto CEO: `data/ceo_photo/*.jpg` → `public/founders/*.webp`
  (dirujuk `photo` di `data/founders.json`). Foto tampil berwarna (tanpa grayscale); tanpa foto = placeholder.
  Atribusi: foto Liquipedia berlisensi CC BY-SA, pertimbangkan baris kredit sebelum rilis.
- Logo 3D lebih gelap & doff (review Axel): env 0.3, key 0.75, rim 1.4, exposure 0.75; saat dimuat material
  dipaksa roughness ≥ 0.75 dan metalness ≤ 0.02 (file glb TIDAK diubah; glb asli terlalu mengkilap, merah jadi
  salmon). Sempat dicoba hanya-cahaya (env 0.12, key 0.9, rim 1.2, exposure 0.8) lalu dikembalikan atas
  permintaan Axel; versi hanya-cahaya ada di commit 546bbc7 bila mau dicoba lagi.
- Bila badge 2D muncul di dev padahal WebGL ada: cek konsol "Failed to fetch dynamically imported module",
  restart `npm run dev` (three.js sudah di `optimizeDeps.include`).
- Achievement baru (dari data Axel): CS2 runner-up ESL Challenger League S52 Asia-Pacific Cup 3 (2026-10-14,
  US$2.500); PUBG Mobile PUBG Master Series 2026 Phase 2 juara (2026-10-11, US$15.600) dan Phase 1 juara ke-3
  (2026-05-10, US$5.250), divisi "Alter Ego PC" (dari Axel: divisi PUBG PC). Summary di file ikut diperbarui (PUBG total 674089).
- Berita: juara AFK Masters (MLBB, `data/mlbb_afk_masters_cup.png`), juara PMS 2026 Phase 2 (PUBG PC,
  `data/pubg_pc_pms_winner_2026.png`), cover AOC Masters CS2 diganti ke `data/ae_cs2_aoc_masters_winner.jpg`.
  Berita PMS Phase 1 juara ke-3 memakai `data/pubg_pc_pms_3_phase1.png` sebagai cover (sesuai keputusan Axel).
- Berita baru: runner-up CS2 (cover poster `data/cs2_runnerup_esl.webp`). PUBG Master Series belum punya
  berita/cover: perlu foto dari Axel (cover wajib di skema berita).
- Logo partner: Good Day Coffee, Interbat, myBCA, Supreme League, Interlac dipotong dari
  `data/partners/Banner Logo Sponsor Latar Transparan.png` (latarnya kotak-kotak palsu, bukan alpha; dipisahkan
  lewat mask kecerahan/saturasi) dan menimpa `public/partners/*.png`. Good Day hanya huruf merahnya (outline putih
  dibuang agar tidak jadi blob saat situs meratakan logo jadi putih). CBN Fiber tetap. gopay sudah didaftarkan
  sebagai partner (`GoPay`). Good Day diperbesar lewat `scale: 1.5` di `data/partners.json` (opsional per partner;
  baris marquee h-64 agar tidak terpotong).
- Marquee partner: skrip mengkloning set sampai layar + satu set tertutup, geser tepat satu set (px),
  kecepatan 28 px/s. Sebelumnya 2 salinan × ±1100px menyisakan gap di layar lebar saat pertama dimuat.

## Keputusan terbaru (revisi dari review Axel)
- Hero: partikel WebGL & logo 3D dihapus → **video highlight sebagai latar, opacity 30%** + gradien.
- Story (`src/components/StorySection.astro`, mekanik di `src/lib/story-scroll.ts`):
  - Scene A: "BANYAK WAJAH / SATU NAMA" + sejarah singkat (berdiri 2018 di Jakarta bersama MLBB & Counter-Strike,
    PUBG Mobile sejak 2023), logo kanan. Tahun dari Axel; CS2 sejak 2024. Sumber awal: id.wikipedia, igames.id.
  - Scene B: logo kiri, deskripsi + **fun fact** (dihitung dari data achievement).
  - Scene C: judul FOUNDER, 5 kartu berundak (5× Delwyn Sukamto, placeholder), logo di belakang kartu, deretan
    berakhir tepat di tengah. Mobile: tumpukan kartu yang bisa di-swipe.
  - Scroll dihaluskan (`smoothProgress`), atribut `data-settled` saat animasi berhenti.
  - **Logo 3D asli (glb + three.js) di desktop** (`src/lib/logo3d.ts`): flip A→B = turntable (putar sumbu Y),
    B→C = somersault (putar sumbu X, sisi belakang terlihat) + mengikuti kursor (`src/lib/logo-look.ts`).
    Fallback: badge 2D CSS (mobile, reduced motion, tanpa WebGL, gagal muat).
- Partikel ambient di section bawah hero: 40 segitiga + 10 kelopak, opacity 35%.
- Nav: Store · Roster · News · Achievements · Join.

## Berikutnya (urut prioritas)
1. Perbarui `docs/DESIGN.md` (Story Scroll: logo 3D, dua flip, kursor) dan tiket 16.
2. Gambar OG khusus 1200×630 untuk landing/store (sekarang logo 1200 px). Opsional: ramping chunk three.js
   (~640 KB, hanya desktop).
3. Tiket 15: cek semua link eksternal, domain produksi (ganti `site` di `astro.config.mjs`).

## Rilis ke Vercel (tiket 15)
- Project Vercel: Root Directory `apps/web`, framework Astro. Opsi "Include source files outside of the Root
  Directory" harus **aktif** (build membaca `data/` dan `packages/shared`). Tidak perlu env wajib.
- Domain: pakai `*.vercel.app` bawaan dulu. `site` diambil dari `VERCEL_PROJECT_PRODUCTION_URL` saat build.
  Domain kustom nanti cukup set env `SITE_URL` di Vercel (tanpa ubah kode).
- Sebelum deploy: `npm test`, `npm run check`, `npm run test:e2e`, lalu `npm run check:links` (laporan link;
  `blocked` = cek manual di browser, `broken` = perbaiki).
- `.vercelignore` tidak mengunggah `docs/`, `brand/`, `data/partners/`, `data/ceo_photo/`, dan file mentah.

## Menunggu dari Axel
- Domain produksi: sudah `alter-ego-esport.vercel.app` (Vercel); domain kustom nanti via env `SITE_URL`.
- Data asli kartu Founder: foto sudah ada; peran Delwyn Sukamto dikonfirmasi "CEO & Founder Alter Ego".
- Teks deskripsi scene A, video lookbook merch, logo resmi Good Day Coffee / myBCA / Supreme League / Interlac,
  foto pemain, link Shopee per produk (sudah tersedia dari banner).
