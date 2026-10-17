# Handoff — status terakhir

> Perbarui file ini di akhir setiap sesi (bagian "Status" dan "Berikutnya"). Terakhir: 2026-10-17.

## Status
- Fase 0–5 (SPEC-MVP) hampir selesai: tiket 02–13 dan 16 **done**; 01 menunggu deploy Vercel oleh Axel;
  14 (SEO & kualitas) dan 15 (rilis produksi) **belum**.
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
- Logo 3D lebih gelap & doff (review Axel): env 0.3, key 0.75, rim 1.4, exposure 0.75; material dipaksa
  roughness ≥ 0.75 dan metalness ≤ 0.02 saat dimuat (glb asli terlalu mengkilap, merah jadi salmon).
- Marquee partner: skrip mengkloning set sampai layar + satu set tertutup, geser tepat satu set (px),
  kecepatan 28 px/s. Sebelumnya 2 salinan × ±1100px menyisakan gap di layar lebar saat pertama dimuat.

## Keputusan terbaru (revisi dari review Axel)
- Hero: partikel WebGL & logo 3D dihapus → **video highlight sebagai latar, opacity 30%** + gradien.
- Story (`src/components/StorySection.astro`, mekanik di `src/lib/story-scroll.ts`):
  - Scene A: "BANYAK WAJAH / SATU NAMA" + deskripsi singkat (placeholder), logo kanan.
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
2. Tiket 14: meta/OG/sitemap/robots, 404, keluarkan `/dev/assets`, Lighthouse mobile > 80. Pertimbangkan
   merampingkan chunk three.js (~640 KB, hanya desktop).
3. Tiket 15: cek semua link eksternal, domain produksi (ganti `site` di `astro.config.mjs`).

## Menunggu dari Axel
- Deploy Vercel (Root Directory `apps/web`).
- Data asli kartu Founder + verifikasi peran Delwyn Sukamto.
- Teks deskripsi scene A, video lookbook merch, logo resmi Good Day Coffee / myBCA / Supreme League / Interlac,
  foto pemain, link Shopee per produk.
