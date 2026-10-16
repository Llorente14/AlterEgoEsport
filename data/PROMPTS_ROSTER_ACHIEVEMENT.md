# Prompt Pengumpulan Data — Roster & Achievement Alter Ego

Dipakai untuk mengisi section **Roster** dan **Achievements** di `DESIGN.md`.
Game saat ini: **Mobile Legends: Bang Bang**, **Counter-Strike 2**, **PUBG Mobile**.
Jalankan prompt di AI yang punya akses web, satu prompt per game.
Hasil disimpan sebagai file JSON:

```
data/
├── roster/
│   ├── mlbb.json
│   ├── cs2.json
│   └── pubgm.json
└── achievements/
    ├── mlbb.json
    ├── cs2.json
    └── pubgm.json
```

Aturan umum untuk semua prompt:
- Sumber utama **Liquipedia**, pendukung: situs resmi turnamen, Instagram resmi Alter Ego.
- Data yang tidak ditemukan diisi `null`. **Jangan mengarang.**
- Setiap entri wajib punya `sources` (URL).
- Output **hanya JSON valid**, tanpa teks pembuka/penutup.
- Tanggal format `YYYY-MM-DD`; jika hanya bulan diketahui `YYYY-MM`.
- Tanggal lahir **tidak dikumpulkan** (privasi pemain).

---

## 1. Skema Bersama

### Player (dipakai semua game)

| Atribut | Tipe | Wajib | Keterangan |
|---------|------|-------|------------|
| `id` | string | ✓ | slug unik, huruf kecil: `nino` |
| `nickname` | string | ✓ | nama in-game, ditampilkan UPPERCASE |
| `fullName` | string \| null | ✓ | nama lengkap |
| `nationality` | string | ✓ | kode ISO-3166 alpha-2: `ID`, `PH`, `MY` |
| `game` | string | ✓ | `mlbb`, `cs2`, `pubgm` |
| `division` | string | ✓ | nama tim/divisi, mis. `Alter Ego`, `Alter Ego X` |
| `type` | `"player"` \| `"staff"` | ✓ | |
| `role` | string | ✓ | dari daftar role per game (lihat bawah) |
| `status` | `"active"` \| `"substitute"` \| `"inactive"` \| `"loan"` | ✓ | |
| `joinDate` | string \| null | ✓ | tanggal bergabung |
| `previousTeams` | string[] | ✓ | urut terbaru dulu, `[]` jika tidak ada |
| `liquipediaUrl` | string \| null | ✓ | |
| `photo` | string \| null | — | diisi tim Alter Ego (path file), biarkan `null` |
| `displayOrder` | number | ✓ | urutan tampil di situs (1 = paling kiri) |
| `gameSpecific` | object | ✓ | atribut khusus per game (lihat bawah) |
| `sources` | string[] | ✓ | URL sumber |

### Achievement (dipakai semua game)

| Atribut | Tipe | Wajib | Keterangan |
|---------|------|-------|------------|
| `id` | string | ✓ | slug: `mpl-id-s8` |
| `game` | string | ✓ | |
| `division` | string | ✓ | `Alter Ego` / `Alter Ego X` / … |
| `tournament` | string | ✓ | nama resmi: `MPL Indonesia Season 8` |
| `tier` | string \| null | ✓ | tier Liquipedia: `S-Tier`, `A-Tier`, `B-Tier`, `C-Tier`, `Qualifier` |
| `startDate` | string \| null | ✓ | |
| `endDate` | string \| null | ✓ | |
| `placement` | string | ✓ | `1`, `2`, `3`, `3-4`, `5-8`, … |
| `placementLabel` | string | ✓ | `Champion`, `Runner-up`, `3rd`, `Top 4`, `Top 8` |
| `prize` | object \| null | ✓ | `{ "amount": 15000, "currency": "USD" }` |
| `location` | string \| null | ✓ | `Jakarta, Indonesia` atau `Online` |
| `lan` | boolean \| null | ✓ | `true` = offline/LAN |
| `rosterIds` | string[] | ✓ | `id` pemain yang bermain di turnamen itu; `[]` jika tidak diketahui |
| `awards` | object[] | ✓ | penghargaan individu: `[{ "playerId": "nino", "award": "Finals MVP" }]` |
| `highlight` | boolean | ✓ | `true` jika layak tampil di landing (juara / runner-up / turnamen dunia) |
| `liquipediaUrl` | string \| null | ✓ | |
| `sources` | string[] | ✓ | |

### Bentuk file

```json
{
  "game": "mlbb",
  "updatedAt": "2026-10-16",
  "players": [ /* Player */ ]
}
```

```json
{
  "game": "mlbb",
  "updatedAt": "2026-10-16",
  "summary": {
    "titles": 0,
    "runnerUps": 0,
    "internationalAppearances": 0,
    "totalPrizeUSD": 0
  },
  "achievements": [ /* Achievement */ ]
}
```

---

## 2. Mobile Legends: Bang Bang (`mlbb`)

**Role pemain:** `EXP Laner`, `Jungler`, `Mid Laner`, `Gold Laner`, `Roamer`
**Role staff:** `Head Coach`, `Coach`, `Analyst`, `Manager`
**Divisi yang dicek:** Alter Ego (MPL ID), Alter Ego X (MDL ID), divisi lain jika ada.

**`gameSpecific` Player:**
| Atribut | Tipe | Keterangan |
|---------|------|------------|
| `league` | string \| null | `MPL ID` / `MDL ID` |
| `nationalTeam` | string \| null | mis. `Indonesia — SEA Games 2025`, `null` jika tidak |

**Turnamen penting:** MPL ID (tiap season), MSC, M-Series World Championship, MDL ID, SEA Games / Asian Games (lewat pemain timnas, catat di `awards`), turnamen A-Tier lain.

### Prompt — Roster MLBB

```
Kamu adalah peneliti data esports. Kumpulkan roster SAAT INI tim Alter Ego
(Indonesia) untuk game Mobile Legends: Bang Bang, termasuk semua divisi
(Alter Ego di MPL ID, Alter Ego X di MDL ID, dan divisi lain jika ada),
pemain dan staff.

Sumber utama: https://liquipedia.net/mobilelegends/Alter_Ego
Sumber pendukung: Instagram resmi @alteregoesports, situs resmi MPL ID.

Aturan:
- Hanya anggota berstatus aktif saat ini (active/substitute/loan).
- Data yang tidak ditemukan isi null. Jangan mengarang.
- Jangan sertakan tanggal lahir.
- nationality pakai kode ISO alpha-2.
- role harus salah satu dari: EXP Laner, Jungler, Mid Laner, Gold Laner,
  Roamer, Head Coach, Coach, Analyst, Manager.
- displayOrder urut: EXP Laner, Jungler, Mid Laner, Gold Laner, Roamer,
  lalu substitute, lalu staff.
- Setiap entri wajib punya array "sources".

Output HANYA JSON valid dengan bentuk:
{
  "game": "mlbb",
  "updatedAt": "<tanggal hari ini YYYY-MM-DD>",
  "players": [
    {
      "id": "nino",
      "nickname": "Nino",
      "fullName": "Syauki Fauzan Sumarno",
      "nationality": "ID",
      "game": "mlbb",
      "division": "Alter Ego",
      "type": "player",
      "role": "EXP Laner",
      "status": "active",
      "joinDate": null,
      "previousTeams": [],
      "liquipediaUrl": null,
      "photo": null,
      "displayOrder": 1,
      "gameSpecific": {
        "league": "MPL ID",
        "nationalTeam": null
      },
      "sources": []
    }
  ]
}
```

### Prompt — Achievement MLBB

```
Kamu adalah peneliti data esports. Kumpulkan SELURUH riwayat hasil turnamen
tim Alter Ego (Indonesia) di Mobile Legends: Bang Bang, semua divisi
(Alter Ego, Alter Ego X, dll.), dari 2018 hingga hari ini.

Sumber utama: https://liquipedia.net/mobilelegends/Alter_Ego/Results
Sumber pendukung: halaman turnamen di Liquipedia, situs resmi MPL ID / MLBB.

Aturan:
- Sertakan semua turnamen tier S, A, dan B; tier C hanya jika juara.
- placement pakai format Liquipedia ("1", "2", "3-4", "5-8").
- placementLabel: Champion, Runner-up, 3rd, Top 4, Top 8, Top 16, Group Stage.
- prize dalam mata uang yang tercantum di Liquipedia (biasanya USD).
- highlight = true untuk: juara, runner-up, atau partisipasi M-Series/MSC.
- awards berisi penghargaan individu pemain Alter Ego di turnamen itu
  (MVP, Finals MVP, dll.). Pakai playerId yang sama dengan file roster jika
  pemainnya masih aktif; jika sudah tidak aktif, pakai slug nickname.
- internationalAppearances = jumlah partisipasi M-Series + MSC.
- Hitung summary dari data yang kamu temukan.
- Data yang tidak ditemukan isi null. Jangan mengarang. Wajib "sources".
- Urutkan achievements dari yang terbaru.

Output HANYA JSON valid dengan bentuk:
{
  "game": "mlbb",
  "updatedAt": "<YYYY-MM-DD>",
  "summary": {
    "titles": 0,
    "runnerUps": 0,
    "internationalAppearances": 0,
    "totalPrizeUSD": 0
  },
  "achievements": [
    {
      "id": "mpl-id-s8",
      "game": "mlbb",
      "division": "Alter Ego",
      "tournament": "MPL Indonesia Season 8",
      "tier": "S-Tier",
      "startDate": null,
      "endDate": null,
      "placement": "4",
      "placementLabel": "4th",
      "prize": null,
      "location": "Jakarta, Indonesia",
      "lan": true,
      "rosterIds": [],
      "awards": [],
      "highlight": false,
      "liquipediaUrl": null,
      "sources": []
    }
  ]
}
```

---

## 3. Counter-Strike 2 (`cs2`)

**Role pemain:** `IGL`, `Entry`, `AWPer`, `Lurker`, `Support`, `Rifler`
**Role staff:** `Head Coach`, `Coach`, `Analyst`, `Manager`
**Divisi yang dicek:** Alter Ego (tim utama), divisi lain jika ada (mis. akademi / tim putri).

**`gameSpecific` Player:**
| Atribut | Tipe | Keterangan |
|---------|------|------------|
| `isIGL` | boolean | in-game leader (pemain ber-role lain bisa juga IGL) |

**Turnamen penting:** Major & qualifier Major (RMR / Asia), ESL Challenger / Pro League qualifier, IEM, liga Indonesia / SEA, turnamen A-Tier lain.

### Prompt — Roster CS2

```
Kamu adalah peneliti data esports. Kumpulkan roster SAAT INI tim Alter Ego
(Indonesia) untuk game Counter-Strike 2, pemain dan staff, semua divisi aktif.

Sumber utama: https://liquipedia.net/counterstrike/Alter_Ego
Sumber pendukung: HLTV (hltv.org), Instagram resmi @alteregoesports.

Aturan:
- Hanya anggota aktif saat ini (active/substitute/loan).
- Data tidak ditemukan isi null. Jangan mengarang. Jangan sertakan tanggal lahir.
- nationality pakai kode ISO alpha-2.
- role harus salah satu dari: IGL, Entry, AWPer, Lurker, Support, Rifler,
  Head Coach, Coach, Analyst, Manager.
- isIGL true hanya jika disebut sebagai in-game leader di sumber.
- displayOrder: IGL dulu, lalu Entry, AWPer, Lurker, Support, Rifler,
  substitute, staff.
- Jika halaman tim tidak ditemukan, kembalikan "players": [].
- Wajib "sources".

Output HANYA JSON valid dengan bentuk:
{
  "game": "cs2",
  "updatedAt": "<YYYY-MM-DD>",
  "players": [
    {
      "id": "",
      "nickname": "",
      "fullName": null,
      "nationality": "ID",
      "game": "cs2",
      "division": "Alter Ego",
      "type": "player",
      "role": "Rifler",
      "status": "active",
      "joinDate": null,
      "previousTeams": [],
      "liquipediaUrl": null,
      "photo": null,
      "displayOrder": 1,
      "gameSpecific": {
        "isIGL": false
      },
      "sources": []
    }
  ]
}
```

### Prompt — Achievement CS2

```
Kamu adalah peneliti data esports. Kumpulkan SELURUH riwayat hasil turnamen
tim Alter Ego (Indonesia) di Counter-Strike 2 (dan CS:GO jika divisi sudah
ada sebelum CS2), semua divisi, hingga hari ini.

Sumber utama: https://liquipedia.net/counterstrike/Alter_Ego/Results
Sumber pendukung: HLTV (hltv.org), halaman turnamen di Liquipedia.

Aturan:
- Sertakan semua turnamen tier S, A, B; tier C hanya jika juara.
- placement format Liquipedia; placementLabel: Champion, Runner-up, 3rd,
  Top 4, Top 8, Top 16, Group Stage.
- highlight = true untuk juara, runner-up, atau lolos ke Major / RMR /
  turnamen internasional.
- awards: penghargaan individu pemain Alter Ego (MVP, dll.).
- internationalAppearances = jumlah turnamen internasional (di luar SEA).
- Hitung summary dari data yang ditemukan.
- Jika halaman tidak ditemukan, kembalikan achievements: [] dan summary 0.
- Data tidak ditemukan isi null. Jangan mengarang. Wajib "sources".
- Urutkan dari yang terbaru.

Output HANYA JSON valid dengan bentuk:
{
  "game": "cs2",
  "updatedAt": "<YYYY-MM-DD>",
  "summary": {
    "titles": 0,
    "runnerUps": 0,
    "internationalAppearances": 0,
    "totalPrizeUSD": 0
  },
  "achievements": [
    {
      "id": "",
      "game": "cs2",
      "division": "Alter Ego",
      "tournament": "",
      "tier": null,
      "startDate": null,
      "endDate": null,
      "placement": "",
      "placementLabel": "",
      "prize": null,
      "location": null,
      "lan": null,
      "rosterIds": [],
      "awards": [],
      "highlight": false,
      "liquipediaUrl": null,
      "sources": []
    }
  ]
}
```

---

## 4. PUBG Mobile (`pubgm`)

**Role pemain:** `IGL`, `Assaulter`, `Fragger`, `Support`, `Scout`
**Role staff:** `Head Coach`, `Coach`, `Analyst`, `Manager`
**Divisi yang dicek:** Alter Ego (tim utama), divisi lain jika ada.

**`gameSpecific` Player:**
| Atribut | Tipe | Keterangan |
|---------|------|------------|
| `isIGL` | boolean | in-game leader |

**Atribut tambahan Achievement (khusus Battle Royale):**
| Atribut | Tipe | Keterangan |
|---------|------|------------|
| `totalPoints` | number \| null | total poin akhir klasemen |
| `totalKills` | number \| null | total eliminasi tim di turnamen |

**Turnamen penting:** PMPL Indonesia (tiap season), PMSL SEA, PMGC, PMWC, SEA Games, turnamen A-Tier lain.

### Prompt — Roster PUBG Mobile

```
Kamu adalah peneliti data esports. Kumpulkan roster SAAT INI tim Alter Ego
(Indonesia) untuk game PUBG Mobile, pemain dan staff, semua divisi aktif.

Sumber utama: https://liquipedia.net/pubgmobile/Alter_Ego
Sumber pendukung: Instagram resmi @alteregoesports, situs resmi PMPL.

Aturan:
- Hanya anggota aktif saat ini (active/substitute/loan).
- Data tidak ditemukan isi null. Jangan mengarang. Jangan sertakan tanggal lahir.
- nationality pakai kode ISO alpha-2.
- role harus salah satu dari: IGL, Assaulter, Fragger, Support, Scout,
  Head Coach, Coach, Analyst, Manager.
- isIGL true hanya jika disebut sebagai in-game leader di sumber.
- displayOrder: IGL dulu, lalu Assaulter, Fragger, Support, Scout,
  substitute, staff.
- Jika halaman tim tidak ditemukan, kembalikan "players": [].
- Wajib "sources".

Output HANYA JSON valid dengan bentuk:
{
  "game": "pubgm",
  "updatedAt": "<YYYY-MM-DD>",
  "players": [
    {
      "id": "",
      "nickname": "",
      "fullName": null,
      "nationality": "ID",
      "game": "pubgm",
      "division": "Alter Ego",
      "type": "player",
      "role": "Assaulter",
      "status": "active",
      "joinDate": null,
      "previousTeams": [],
      "liquipediaUrl": null,
      "photo": null,
      "displayOrder": 1,
      "gameSpecific": {
        "isIGL": false
      },
      "sources": []
    }
  ]
}
```

### Prompt — Achievement PUBG Mobile

```
Kamu adalah peneliti data esports. Kumpulkan SELURUH riwayat hasil turnamen
tim Alter Ego (Indonesia) di PUBG Mobile, semua divisi, hingga hari ini.

Sumber utama: https://liquipedia.net/pubgmobile/Alter_Ego/Results
Sumber pendukung: halaman turnamen di Liquipedia, situs resmi PMPL / PMGC.

Aturan:
- Sertakan semua turnamen tier S, A, B; tier C hanya jika juara.
- placement = peringkat akhir klasemen ("1", "5", "12").
- placementLabel: Champion, Runner-up, 3rd, Top 5, Top 8, Top 16, Group Stage.
- totalPoints dan totalKills diambil dari klasemen akhir; null jika tidak ada.
- highlight = true untuk juara, runner-up, atau lolos ke PMSL / PMGC / PMWC.
- awards: penghargaan individu pemain Alter Ego (MVP, Most Kills, dll.).
- internationalAppearances = jumlah partisipasi PMGC + PMWC + turnamen
  internasional lain.
- Hitung summary dari data yang ditemukan.
- Jika halaman tidak ditemukan, kembalikan achievements: [] dan summary 0.
- Data tidak ditemukan isi null. Jangan mengarang. Wajib "sources".
- Urutkan dari yang terbaru.

Output HANYA JSON valid dengan bentuk:
{
  "game": "pubgm",
  "updatedAt": "<YYYY-MM-DD>",
  "summary": {
    "titles": 0,
    "runnerUps": 0,
    "internationalAppearances": 0,
    "totalPrizeUSD": 0
  },
  "achievements": [
    {
      "id": "",
      "game": "pubgm",
      "division": "Alter Ego",
      "tournament": "",
      "tier": null,
      "startDate": null,
      "endDate": null,
      "placement": "",
      "placementLabel": "",
      "totalPoints": null,
      "totalKills": null,
      "prize": null,
      "location": null,
      "lan": null,
      "rosterIds": [],
      "awards": [],
      "highlight": false,
      "liquipediaUrl": null,
      "sources": []
    }
  ]
}
```

---

## 5. Cara Pakai di Situs

- **Section Roster:** tab per `game` (MLBB · CS2 · PUBG Mobile) → per `division`; tampilkan `type: "player"` berurutan `displayOrder`; staff di baris kecil di bawah. Pemain dengan `photo: null` memakai placeholder siluet topeng.
- **Section Achievements (landing):** ambil `summary` tiap game untuk Achievement Stat (angka besar), lalu daftar entri `highlight: true` terbaru (maks 6).
- **Halaman Roster / Achievements penuh:** semua entri, filter per game dan tahun.
- **Validasi sebelum dipakai:** cek ulang setiap entri `highlight: true` ke `sources`, karena AI bisa salah membaca tabel Liquipedia.
