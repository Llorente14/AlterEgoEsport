# 15: Rilis produksi

**What to build:** Situs MVP live di domain produksi dengan semua link eksternal berfungsi.

**Blocked by:** 14, 01

**Status:** in-progress (menunggu deploy Vercel oleh Axel)

- [x] Cek otomatis semua link eksternal (Shopee ×6, Tokopedia, WhatsApp, sosmed ×5, Maps, Linktree): `npm run check:links`
- [x] Site URL diambil dari `VERCEL_PROJECT_PRODUCTION_URL` (domain bawaan Vercel); domain kustom nanti lewat env `SITE_URL`
- [ ] Deploy Vercel oleh Axel (Root Directory `apps/web`), lalu URL produksi dicek
- [x] Seluruh tes lulus sebelum deploy
