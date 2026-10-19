# Alter Ego Web

Situs resmi **Alter Ego Esports** dan **Alter Merch**: landing page tim, toko merchandise, dan berita.

## Tujuan

Penggemar Alter Ego sekarang harus pindah-pindah antara Linktree, Instagram, Liquipedia, Shopee, dan Tokopedia untuk
tahu roster, prestasi, berita, atau beli jersey. Situs ini mengumpulkan semuanya di satu tempat dengan identitas brand
sendiri (hitam–merah–putih, topeng tiga wajah).

## Isi situs

| Halaman | Fungsi |
|---|---|
| `/` | Landing: hero, cerita tim, roster, Alter Merch, prestasi, berita, partner, ajakan bergabung |
| `/store`, `/store/kategori/<k>` | Katalog merch (85 produk) per kategori |
| `/store/<slug>` | Detail produk, tombol **Beli Sekarang** ke Shopee (fallback ke toko), Tokopedia sebagai pilihan kedua |
| `/news`, `/news/<slug>` | Daftar dan artikel berita pertandingan |

Roster mencakup Mobile Legends (MPL dan MDL), Counter-Strike 2, dan PUBG Mobile.

## Status

MVP (fase 0–5 di [`docs/SPEC-MVP.md`](docs/SPEC-MVP.md)) hampir selesai. Belum dirilis ke domain produksi.
Checkout di situs sendiri (keranjang, pembayaran) adalah fase 6 dan belum dikerjakan: untuk sekarang pembelian
lewat marketplace. Status rinci: [`docs/HANDOFF.md`](docs/HANDOFF.md).

## Teknologi

Astro 7, Tailwind CSS v4, TypeScript, Zod (validasi data), Three.js (logo 3D di desktop), Vitest, Playwright.
Monorepo npm workspaces; fase 6 rencananya menambah NestJS + PostgreSQL/Prisma di `apps/api`.

## Menjalankan

Jalankan dari root repo:

```
npm install
npm run dev            # dev server di http://localhost:4321
npm run build          # build statis (cek aset dulu, lalu astro build)
npm run preview        # lihat hasil build
npm test               # unit test (Vitest)
npm run test:e2e       # E2E (Playwright, port 4322)
npm run check          # cek tipe (astro check)
```

`PUBLIC_STORE_MODE` menentukan mode toko saat build: `marketplace` (default) atau `native` (fase 6, belum jadi).

## Struktur

```
apps/web/        situs (komponen, halaman, lib/catalog, tes)
apps/web/src/content/news/   artikel berita (Markdown)
packages/shared/ tipe domain bersama
data/            konten mentah: roster, prestasi, produk, partner, link
brand/           sumber logo (SVG, skrip Blender, glb)
docs/            spec, desain, handoff, tiket
```

## Mengubah konten

Konten dibaca hanya lewat `apps/web/src/lib/catalog` dan divalidasi saat build. Data yang salah bentuk membuat
build gagal, bukan tampil rusak.

- **Roster, prestasi, produk, partner:** edit file di `data/`. Skema roster/prestasi ada di
  [`data/PROMPTS_ROSTER_ACHIEVEMENT.md`](data/PROMPTS_ROSTER_ACHIEVEMENT.md).
- **Berita:** tambah file Markdown di `apps/web/src/content/news/`. Cover wajib.
- **Foto roster:** setelah mengubah `profileImg`, jalankan `npm run fetch:photos -w @alterego/web`.
- **Gambar produk:** `npm run fetch:images -w @alterego/web`.

## Dokumentasi

- [`docs/HANDOFF.md`](docs/HANDOFF.md): status terakhir dan pekerjaan berikutnya. Mulai dari sini.
- [`docs/SPEC-MVP.md`](docs/SPEC-MVP.md): problem, scope, fase, user story, keputusan teknis.
- [`docs/DESIGN.md`](docs/DESIGN.md): token warna, font, komponen, motion.
- [`docs/tickets/`](docs/tickets/): tiket per fitur.
- [`CLAUDE.md`](CLAUDE.md): konvensi kerja dan jebakan teknis.

## Lisensi

Belum ditentukan. Logo, foto pemain, dan materi brand milik Alter Ego dan pihak terkait; jangan dipakai ulang
tanpa izin.
