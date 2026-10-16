# 01: Kerangka situs + token desain, tampil di preview

**What to build:** Pengunjung membuka URL preview dan melihat halaman hitam Alter Ego dengan Nav dan Footer kosong, memakai font dan token warna dari DESIGN.md. Repo git siap dengan file mentah besar dikecualikan. Tes otomatis (unit + E2E) sudah bisa dijalankan.

**Blocked by:** None (can start immediately)

**Status:** in-progress (menunggu deploy Vercel oleh user)

- [x] Repo git terinisialisasi; file mentah besar (glb 127 MB, .blend, video mentah, node_modules, build output) dikecualikan
- [x] Monorepo npm workspaces: aplikasi web Astro + paket tipe bersama
- [x] Tailwind v4 dengan token identik Quick Start DESIGN.md (warna, tipografi, spacing, radius, motion)
- [x] Font Anton, Chakra Petch (400/500/600), JetBrains Mono termuat
- [x] Halaman beranda: latar #000, Nav (logo + link) dan Footer kerangka
- [x] Vitest berjalan (1 tes contoh); Playwright smoke test: halaman terbuka, latar body rgb(0,0,0), font display Anton
- [x] Build produksi lulus tanpa error
- [ ] Deploy preview Vercel (user login sendiri)
