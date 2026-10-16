# 12: Hero 3D desktop

**What to build:** Pengunjung desktop melihat partikel dan kelopak sakura mengalir kanan→kiri lalu membentuk logo 3D Alter Ego.

**Blocked by:** 08

**Status:** done

- [x] Dimuat hanya di ≥1024px tanpa reduced-motion; di bawahnya Three.js dan glb tidak diunduh
- [x] Logo glb (meshopt) dimuat; PNG placeholder sampai siap; fallback tipografi bila WebGL gagal
- [x] ±5.000 partikel + ±80 kelopak, morph ke logo, terlepas sebagian, kursor & scroll sesuai DESIGN.md
- [x] Render berhenti saat hero di luar viewport
- [x] E2E: mobile tidak meminta glb; desktop memasang kanvas

Catatan: diukur 113 fps di Chrome dengan Intel Iris Xe (1440×900). Chunk scene ±670 KB (belum gzip), hanya diunduh di desktop.
