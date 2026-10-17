# Alter Ego Web — panduan untuk Claude

Situs resmi **Alter Ego Esports** (brand induk) dan **Alter Merch** (store). Landing page + store + berita.
Pemilik: Axel (Llorente14). Bahasa komunikasi dan teks situs: **Indonesia**.

## Baca dulu (sumber kebenaran)
1. `docs/HANDOFF.md` — status terakhir, pekerjaan tersisa, keputusan terbaru. **Mulai dari sini.**
2. `docs/SPEC-MVP.md` — problem, scope MVP, fase 0–6 + Definition of Done, user stories, keputusan teknis.
3. `docs/DESIGN.md` — design system (token warna/font/spacing, komponen, motion, sitemap, store modes).
4. `docs/tickets/issues/NN-*.md` — tiket per fitur (status di tiap file).
5. `data/PROMPTS_ROSTER_ACHIEVEMENT.md` — skema data roster/achievement.

## Struktur
- `apps/web` — Astro 7 + Tailwind v4 + TypeScript (situs). `packages/shared` — tipe domain bersama.
- `data/` — konten mentah (roster, achievement, produk Shopee, links, partners, founders). Dibaca **hanya** lewat
  katalog `apps/web/src/lib/catalog` (validasi Zod; data rusak = build gagal). Alias impor: `@data/*`.
- `brand/` — sumber logo (SVG layer, skrip Blender, glb teroptimasi). `_source/` — file mentah besar (di-ignore).
- Fase 6 (checkout native) nanti: NestJS + PostgreSQL/Prisma di `apps/api`. Flag `PUBLIC_STORE_MODE=native`.

## Perintah (dari `alterego_web/`)
```
npm run dev            # dev server :4321
npm run build && npm run preview
npm test               # Vitest (unit, cepat)
npm run test:e2e       # Playwright, port 4322 (tidak bentrok dengan dev)
npm run check          # astro check (tipe)
```
`astro preview` hanya boleh satu instance: hentikan dengan `npx astro preview stop` di `apps/web`.

## Konvensi kerja (wajib)
- **Commit atomic**, pesan bahasa Inggris gaya conventional (`feat(web): …`). **Tanpa baris `Co-Authored-By`.**
  Axel yang **push** sendiri; jangan push, jangan force-push.
- Saat ada file yang dihapus dengan `git rm`, commit dengan pathspec eksplisit (`git commit -- <path>`) supaya
  penghapusan tidak ikut ke commit lain dan setiap commit tetap bisa dibuild.
- Cek exit code tes sebelum commit (`echo $?` / `PIPESTATUS`), jangan hanya `grep passed`.
- Perubahan visual **diverifikasi dengan Playwright + screenshot** (Chrome GPU:
  `chromium.launch({ channel: 'chrome', args: ['--ignore-gpu-blocklist','--use-angle=d3d11','--enable-gpu'] })`).
- **Jangan mengarang data** (prestasi, tanggal, peran). Kalau data tidak ada, pakai placeholder dan bilang.
- Pakai tool Write/Edit untuk patch besar; heredoc Python panjang di bash sering gagal parsing.

## Jebakan teknis yang sudah pernah terjadi
- Tailwind: `--spacing: 1px`, jadi angka utilitas = px (`gap-24` = 24px, `h-80` = 80px). Jangan pakai
  `var(--spacing-N)` (tidak ada).
- Section pinned pakai `overflow: clip` (bukan `hidden`, yang merusak `sticky`) dan `data-no-reveal`
  (efek reveal memberi transform/opacity yang menggeser posisi).
- Model `alterego-logo.glb` (meshopt) terbaring datar dari Blender: putar `rotation.x = π/2`; perlu `MeshoptDecoder`.
  Redupkan lewat `scene.environmentIntensity` + intensitas lampu (bukan `envMapIntensity`, bukan transparansi).
- WebGL di Chromium headless = software render. Proyek Playwright `desktop`/`mobile` jalan dengan
  `--disable-3d-apis` (menguji fallback 2D); proyek `desktop-3d` khusus `tests/e2e/logo3d.spec.ts`.
- Gambar produk dari Shopee berlatar putih (bukan bug kode).
- Delwyn Sukamto: Axel menyebutnya "Founder Alter Ego", tapi hasil pencarian menyebutnya CEO Interbat (partner).
  Perlu verifikasi sebelum rilis.
