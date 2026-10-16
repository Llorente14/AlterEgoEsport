# 04: Katalog + section Roster

**What to build:** Pengunjung landing melihat roster aktif per game (MLBB · CS2 · PUBG Mobile) dalam tab, dikelompokkan per divisi, dengan staff terpisah. Semua data dibaca lewat modul katalog yang memvalidasi file data saat build.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Modul katalog membaca roster 3 game dari folder data, memvalidasi skema; data rusak menggagalkan build dengan pesan file + entri
- [x] Roster terurut game → divisi (Alter Ego dulu, lalu alfabet) → displayOrder; pemain dan staff terpisah
- [x] Section Roster: tab ARIA (panah kiri/kanan), game aktif di hash URL, berfungsi tanpa JavaScript (semua panel tampil)
- [x] Roster Card sesuai DESIGN.md; foto kosong → siluet topeng + label nama
- [x] Tes katalog (fixture: urutan, staff terpisah, data rusak) dan E2E (pindah tab dengan keyboard)
