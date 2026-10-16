# 12: Hero 3D desktop

**What to build:** Pengunjung desktop melihat partikel dan kelopak sakura mengalir kanan→kiri lalu membentuk logo 3D Alter Ego.

**Blocked by:** 08

**Status:** ready-for-agent

- [ ] Dimuat hanya di ≥1024px tanpa reduced-motion; di bawahnya Three.js dan glb tidak diunduh
- [ ] Logo glb (meshopt) dimuat; PNG placeholder sampai siap; fallback tipografi bila WebGL gagal
- [ ] ±5.000 partikel + ±80 kelopak, morph ke logo, terlepas sebagian, kursor & scroll sesuai DESIGN.md
- [ ] Render berhenti saat hero di luar viewport
- [ ] E2E: mobile tidak meminta glb; desktop memasang kanvas
