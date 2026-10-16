# Alter Ego — Style Reference
> Topeng merah melayang di atas kanvas hitam, kelopak sakura terbawa angin dari kanan ke kiri

**Theme:** dark
**Versi:** 1.0 · 2026-10-16
**Sumber gabungan:** `DESIGN (3).md` (Dala — void hitam, partikel) + `DESIGN (4).md` (Dayos — editorial brutalist, kondensed UPPERCASE) + logo `Alter_Ego_Logo.png` + sentuhan Jepang (sakura, seigaiha, hanko).

Alter Ego adalah situs satu-pintu untuk **Alter Ego Esports** (brand induk) dan **Alter Merch** (sub-brand store). Basis visualnya diambil dari Dala: kanvas **#000000 murni**, tanpa panel abu-abu, hierarki dari skala dan bukan dari dekorasi. Strukturnya diambil dari Dayos: headline **Anton UPPERCASE** raksasa dengan line-height 0.9, label mono kecil bernomor, radius besar, dan permukaan flat tanpa shadow. Violet Dala dan mint/kuning Dayos diganti **merah logo**, satu-satunya warna kromatik. Merah dipakai untuk aksi dan aksen, tidak pernah untuk blok latar besar.

Gestur khas brand adalah **aliran partikel dari kanan ke kiri**: segitiga kecil merah, putih, dan abu, bercampur kelopak sakura, terus melayang melintasi hero, lalu berkumpul membentuk logo 3D perisai tiga-topeng dan terlepas lagi. Unsur Jepang hadir halus tanpa huruf kana atau kanji: kelopak sakura, pola gelombang **seigaiha** sebagai tekstur tipis, dan badge berbentuk **hanko** (cap merah bulat). Di mobile tidak ada 3D; yang bekerja hanya tipografi dan struktur.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Kanvas halaman dan semua latar section. Hitam murni, bukan abu gelap — void adalah desainnya |
| Ink | `#0D0D0D` | `--color-ink` | Permukaan kartu produk (HANYA di Store/Produk), latar video sebelum dimuat |
| Ink Raised | `#161616` | `--color-ink-raised` | Drawer keranjang, input form, dropdown, panel checkout |
| Hairline | `#262626` | `--color-hairline` | Garis tipis 1px: border input, pemisah baris tabel keranjang, outline tombol sekunder di permukaan Ink |
| Bone White | `#FFFFFF` | `--color-bone` | Headline, body utama, ikon, teks di atas tombol merah |
| Ash | `#9A9A9A` | `--color-ash` | Teks sekunder, nav tidak aktif, metadata, harga coret |
| Silver Mist | `#BDBDBD` | `--color-silver` | Teks tersier, caption, keterangan kecil |
| Ego Red | `#CC1510` | `--color-ego-red` | **Latar tombol utama** (Beli Sekarang / Tambah ke Keranjang), titik aktif, garis aktif. Kontras teks putih 5.7:1 (lolos WCAG AA) |
| Ego Red Hover | `#E01A12` | `--color-ego-red-hover` | Hover/pressed tombol utama. Kontras teks putih 4.9:1 |
| Signal Red | `#EE2B20` | `--color-signal-red` | Merah untuk **teks kecil** di atas hitam (label, tag outline, link aktif). Kontras di atas #000 ±5:1 |
| Blood | `#7A0A0E` | `--color-blood` | Ujung gelap gradien logo; hanya di logo 3D, partikel, dan glow rim-light. Bukan untuk UI |

**Gradien logo** (`#EE2B20 → #7A0A0E`, arah kiri-atas ke kanan-bawah) hanya boleh muncul di logo, partikel, dan rim-light 3D. Komponen UI selalu flat.

**Tidak ada warna lain.** Hijau, biru, kuning, violet dilarang, termasuk untuk status. Status sukses/gagal memakai putih + ikon, atau Signal Red untuk error.

---

## Tokens — Typography

### Anton — Display & headline · `--font-display`
- **Substitute:** Barlow Condensed 700, Bebas Neue
- **Weights:** 400 (Anton hanya punya satu bobot, sudah tebal)
- **Sizes:** 40, 56, 88, 128px (desktop)
- **Line height:** 0.90 (display), 0.95 (heading)
- **Letter spacing:** -0.01em (Anton sudah kondensed; tracking negatif besar membuat huruf menempel)
- **Case:** SELALU UPPERCASE
- **Role:** Suara brand. Headline hero, judul section, nama pemain, judul produk di halaman produk, angka besar achievement. Tidak pernah di bawah 28px.

### Chakra Petch — Body & UI · `--font-body`
- **Substitute:** Barlow, system-ui
- **Asal:** Cadson Demak (foundry Thailand) — sudut siku yang terpotong memberi rasa teknikal/esport dan sentuhan Asia yang halus
- **Weights:** 400 (body), 500 (UI, harga), 600 (tombol, label penting)
- **Sizes:** 14, 16, 18, 20, 24px
- **Line height:** 1.6 (body), 1.3 (UI), 1.2 (subheading)
- **Letter spacing:** normal untuk body; 0.04em untuk tombol/nav UPPERCASE
- **Role:** Paragraf ditulis dengan **Chakra Petch 400 18px**. Jangan pakai 300 — bentuk siku menjadi terlalu tipis di atas hitam. Nav, tombol, form, dan harga memakai 500–600.

### JetBrains Mono — Label & metadata · `--font-mono`
- **Substitute:** IBM Plex Mono, ui-monospace
- **Weights:** 400, 500
- **Sizes:** 11, 12px
- **Line height:** 1.4
- **Letter spacing:** 0.06em, UPPERCASE
- **Role:** Nomor section (`01 / SHOWREEL`), tanggal berita, kode produk, varian ukuran, role pemain, indikator slide. Counterpoint teknis terhadap Anton.

### Type Scale

| Role | Family | Weight | Size (desktop) | Size (mobile) | Line Height | Letter Spacing | Token |
|------|--------|--------|----------------|---------------|-------------|----------------|-------|
| label | Mono | 400 | 12px | 11px | 1.4 | 0.06em | `--text-label` |
| caption | Chakra Petch | 400 | 14px | 13px | 1.4 | — | `--text-caption` |
| ui | Chakra Petch | 500 | 16px | 15px | 1.3 | — | `--text-ui` |
| body | Chakra Petch | 400 | 18px | 16px | 1.6 | — | `--text-body` |
| subheading | Chakra Petch | 400 | 24px | 20px | 1.2 | -0.01em | `--text-subheading` |
| heading-sm | Anton | 400 | 40px | 28px | 0.95 | -0.01em | `--text-heading-sm` |
| heading | Anton | 400 | 56px | 40px | 0.95 | -0.01em | `--text-heading` |
| display | Anton | 400 | 88px | 56px | 0.90 | -0.01em | `--text-display` |
| display-xl | Anton | 400 | 128px | 72px | 0.90 | -0.01em | `--text-display-xl` |

Pakai `clamp()` di antara nilai mobile dan desktop, misalnya `--text-display-xl: clamp(72px, 10vw, 128px)`.

---

## Tokens — Spacing & Shapes

**Base unit:** 8px · **Density:** lega di landing, sedang di Store/Checkout

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--space-4` |
| 8 | 8px | `--space-8` |
| 16 | 16px | `--space-16` |
| 24 | 24px | `--space-24` |
| 32 | 32px | `--space-32` |
| 48 | 48px | `--space-48` |
| 64 | 64px | `--space-64` |
| 96 | 96px | `--space-96` |
| 128 | 128px | `--space-128` |

### Border Radius

| Element | Value | Token |
|---------|-------|-------|
| Tombol, input, stepper qty | 8px | `--radius-control` |
| Kartu produk, foto roster, thumbnail berita, frame video | 24px | `--radius-card` |
| Drawer keranjang (sudut kiri), top-arc section | 32px | `--radius-panel` |
| Tag, chip filter, badge hanko | 9999px | `--radius-pill` |

Alasan: tombol 8px terasa tegas dan "kompetitif" (gaya Dayos), sedangkan media dan kartu 24px menjaga kelembutan Dala. Badge hanko selalu bulat penuh.

### Layout
- **Page max-width:** 1280px, gutter 24px desktop / 16px mobile
- **Grid:** 12 kolom desktop, 4 kolom mobile
- **Section gap:** 96–128px desktop, 64px mobile
- **Breakpoints:** mobile < 768px · tablet 768–1023px · desktop ≥ 1024px

---

## Components

### Navigation Bar
Transparan di atas Void, tinggi 80px, sticky dengan latar `rgba(0,0,0,0.8)` + `backdrop-filter: blur(12px)` setelah scroll 80px. Kiri: logo perisai 2D (32px) + wordmark "ALTER EGO" Anton 20px. Tengah: STORE · ROSTER · NEWS · ACHIEVEMENTS · JOIN dalam Chakra Petch 500 14px UPPERCASE 0.04em, Ash (tidak aktif) / Bone (aktif, dengan garis bawah Ego Red 2px). Kanan: ikon keranjang (hanya tampil di mode `native`) + tombol utama **SHOP**. Mobile: logo + tombol hamburger; menu full-screen hitam dengan link Anton 40px bertumpuk.

### Primary Button
**Role:** Satu-satunya aksi utama per layar.
Latar Ego Red `#CC1510`, teks Bone, Chakra Petch 600 14px UPPERCASE 0.04em, padding 16px × 24px, radius 8px, tinggi min 48px. Hover: Ego Red Hover `#E01A12` + ikon panah bergeser 4px ke kanan. Focus: outline 2px Bone, offset 2px. Disabled: latar Hairline, teks Ash. **Maksimal satu Primary Button yang terlihat per viewport.**

### Secondary Button (Outline)
Latar transparan, border 1.5px Bone 40% opacity, teks Bone, Chakra Petch 500 14px UPPERCASE, radius 8px, padding sama dengan Primary. Hover: border Bone 100%. Dipakai untuk "Tokopedia", "Lihat Semua", "Tonton dengan Suara".

### Ghost Link
Tanpa latar dan border. Chakra Petch 400 16px, Ash → Bone saat hover, garis bawah 1px muncul dari kiri. Link inline di paragraf memakai Signal Red.

### Section Label
Mono 12px UPPERCASE, Ash, format `01 / SHOWREEL`. Angka memakai Signal Red. Selalu di atas headline section, jarak 16px.

### Hanko Badge
**Role:** Status produk dan berita — NEW, LIMITED, SOLD OUT, PRE-ORDER, MATCH, RESULT.
Lingkaran 56px (desktop) / 44px (mobile), border 2px Signal Red, teks Mono 500 10px UPPERCASE Signal Red, diputar -8°. Tepi lingkaran sedikit kasar (SVG mask "ink stamp") supaya terasa seperti cap tinta. Varian **filled** (latar Ego Red, teks Bone) khusus SOLD OUT. Diletakkan menimpa sudut kanan-atas foto produk/berita. Hanya teks Latin.

### Tag / Chip
Pill, border 1px Hairline, teks Mono 12px Silver, padding 6px × 12px. Aktif (filter terpilih): border Signal Red, teks Bone.

### Seigaiha Divider & Texture
Pola gelombang seigaiha (busur konsentris bertumpuk) sebagai SVG.
- **Divider:** strip setinggi 24px, stroke 1px Bone 8% opacity, full-width, di antara section besar.
- **Texture:** pola diulang di latar Footer dan header Store dengan opacity 4%. Jangan dipakai di belakang teks body.

### Hero Headline Block
Kiri (kolom 1–6): Section Label `ALTER EGO ESPORTS · EST. 2018`, headline Anton display-xl Bone 3 baris (contoh: "WEAR / YOUR / ALTER EGO"), paragraf Chakra Petch 400 18px Silver maks 440px, lalu Primary Button "SHOP ALTER MERCH" dan Ghost Link "Lihat Roster →". Latar: video 30% (lihat Motion → Hero Background Video).

### Logo Slide
> Revisi 2026-10-17: menggantikan Showreel Frame (video sudah dipakai di hero).

Section 2, dipin di bawah nav selama 300dvh scroll (bagian dalam `sticky`, `top: 80px`, tinggi `100dvh − 80px`, `overflow: clip`). Logo perisai 2D (WebP 800/1200) di tengah area di bawah nav, tinggi `min(62dvh, 42vw)` di desktop (`min(62dvh, 80vw)` di mobile) sehingga selalu muat di layar desktop ukuran berapa pun.
- **0–35% scroll:** logo masuk dari luar kanan ke tengah (ease-out), miring 8° → 0°.
- **35–65%:** diam tegak di tengah.
- **65–100%:** keluar ke luar kiri (ease-in), miring 0° → −8°. Jarak luar layar = ½ lebar layar + 0,6 × lebar logo + 24px (cukup untuk logo yang miring).
- **Latar:** "ALTER EGO · ALTER EGO" Anton outline 1px Bone 20%, `min(28vw, 40dvh)`, bergeser ke kiri lebih cepat (parallax).
- Tanpa JavaScript atau dengan reduced-motion: logo statis di tengah, tanpa pin. Section ini tidak memakai reveal.
- Tanpa library animasi (sticky CSS + ±40 baris JS).

### Manifesto Block
Dua kolom asimetris tanpa kartu: kiri headline Anton display ("BANYAK WAJAH. / SATU NAMA."), kanan paragraf Chakra Petch 400 18px. Disertai satu siluet tiga-topeng outline tipis sebagai ornamen.

### Roster Card
**Tanpa latar, tanpa border** (aturan Dala). Foto potret rasio 3:4, radius 24px, grayscale 100% → warna penuh saat hover + rim merah tipis (box-shadow inset 0 0 0 1px Signal Red). Di bawah foto: role Mono 12px Signal Red (`EXP LANER · MOBILE LEGENDS`), nickname Anton heading-sm Bone, nama lengkap Chakra Petch 400 16px Ash, ikon bendera kecil.
**Placeholder "SOON":** kotak rasio 3:4 radius 24px, border 1px dashed Hairline, siluet topeng tengah 10% opacity, label Mono "SOON".

### Product Card (Store only)
Latar Ink `#0D0D0D`, radius 24px, tanpa shadow, padding 16px. Foto produk rasio 1:1 radius 16px di atas latar Ink Raised `#161616`; foto kedua muncul saat hover. Hanko Badge opsional di sudut. Di bawah: nama Chakra Petch 500 16px Bone (2 baris maks), harga Chakra Petch 500 18px Bone, harga coret Ash. Area aksi mengikuti **Store Mode** (lihat bagian Store Modes). Seluruh kartu bisa diklik ke halaman Produk; tombol aksi punya target klik sendiri.

### Product Detail
Desktop dua kolom: kiri galeri (gambar utama 1:1 radius 24px + thumbnail strip), kanan info sticky: Section Label kode produk, judul Anton heading, harga, pilihan varian (chip ukuran S–XXL, chip warna), tabel ukuran (link membuka modal), lalu area aksi Store Mode, lalu deskripsi Chakra Petch 400 dan accordion (Bahan · Perawatan · Pengiriman). Mobile: galeri swipe full-width, info di bawah, area aksi menempel di bawah layar (sticky bar 72px, latar Void 95%).

### Quantity Stepper (mode native)
Tiga segmen dalam satu kontrol: `−` · angka · `+`. Tinggi 48px, radius 8px, border 1px Hairline, latar Ink Raised. Tombol − dan + berukuran 48×48px, ikon Bone; disabled (qty=1 atau stok habis) Ash. Angka Chakra Petch 500 16px, tidak bisa diketik kurang dari 1 atau melebihi `stock`.

### Cart Drawer (mode native)
Panel dari kanan, lebar 440px (desktop) / 100% (mobile), latar Ink Raised, radius 32px di sudut kiri-atas dan kiri-bawah, overlay Void 60%. Isi: header "KERANJANG (n)" Anton heading-sm + tombol tutup; daftar item (thumbnail 72px radius 12px, nama, varian Mono, Quantity Stepper, harga, link "Hapus" Ash); footer sticky: subtotal, catatan "Ongkir dihitung di checkout", Primary Button "CHECKOUT". Keranjang kosong: siluet topeng + "Keranjang masih kosong" + Secondary Button "Belanja Sekarang".

### Checkout Form (mode native)
Satu halaman, dua kolom desktop (form kiri 7 kolom, ringkasan pesanan kanan 5 kolom sticky). Langkah bernomor dengan Section Label: `01 / KONTAK` (email, WhatsApp) · `02 / PENGIRIMAN` (nama, alamat, provinsi/kota/kecamatan, kode pos, pilihan kurir) · `03 / PEMBAYARAN` (QRIS, Virtual Account, e-wallet — daftar dari gateway). Input: tinggi 52px, radius 8px, latar Ink Raised, border Hairline, focus border Bone; label Chakra Petch 500 14px di atas input; error teks Signal Red 14px + border Signal Red. Ringkasan: item, subtotal, ongkir, total Anton heading-sm, Primary Button "BAYAR SEKARANG".

### Order Status (mode native)
Halaman konfirmasi: Hanko Badge besar 120px ("PAID" / "PENDING" / "FAILED"), nomor pesanan Mono, ringkasan, Secondary Button "Lanjut Belanja".

### News Card
Thumbnail 16:9 radius 24px + Hanko Badge kategori (MATCH, RESULT, MERCH, ROSTER). Tanggal Mono 12px Ash (`16 OKT 2026`), judul Anton 28px Bone (3 baris maks), ringkasan Chakra Petch 400 16px Silver (2 baris). Tanpa latar kartu. Grid 3 kolom desktop / 1 kolom mobile; berita pertama di halaman News tampil besar (featured, 8 kolom).

### Article Page
Kolom baca maks 720px. Section Label kategori + tanggal, judul Anton display, gambar utama full-width radius 24px, body Chakra Petch 400 18px line-height 1.7, subjudul Anton heading-sm, kutipan dengan garis kiri 2px Ego Red. Di akhir: "Berita Lainnya" (3 News Card).

### Achievement Stat
Angka besar Anton display Bone (`#2`, `7×`, `2018`) + label Mono Ash di bawah + keterangan Chakra Petch 400 16px. Baris horizontal, dipisah garis vertikal 1px Hairline. Mobile: grid 2 kolom.

### Partner Strip
Logo partner monokrom putih (filter ke Bone 70% opacity → 100% saat hover), tinggi seragam 40px, jarak 64px. Desktop: marquee pelan **kanan ke kiri** (searah aliran partikel), berhenti saat hover. Mobile: grid 3 kolom statis. Label `09 / PARTNERS` di atas.

### Join Block
Headline Anton display "JOIN THE / ALTER EGO". Dua kolom grup sosmed: **Alter Ego Esports** dan **Alter Merch**, masing-masing daftar link besar (Chakra Petch 500 24px + ikon + panah) dengan garis bawah Hairline per baris, hover garis berubah Ego Red dan panah bergeser.

### Footer
Latar Void + tekstur seigaiha 4%. Empat kolom: (1) logo + tagline + alamat offline store, (2) Navigasi, (3) Belanja — Shopee per negara, Tokopedia, WhatsApp worldwide, (4) Sosmed. Baris bawah: `© 2026 ALTER EGO ESPORTS` Mono Ash + link Privasi/Syarat. Wordmark "ALTER EGO" Anton raksasa (lebar penuh, Bone 6% opacity) sebagai penutup.

---

## Motion

Prinsip: **semua bergerak dari kanan ke kiri**, pelan, seperti angin. Easing standar `cubic-bezier(0.22, 1, 0.36, 1)`; durasi UI 200–400ms.

### Hero Background Video
> Revisi 2026-10-17: partikel WebGL dan logo 3D di hero dihapus setelah review (terlalu ramai, penempatan buruk). Hero memakai video.

- **Medium:** video highlight (`showreel-720.webm`/`.mp4`, `showreel-480.mp4` di < 768px) sebagai latar penuh hero, `object-cover`, **opacity 30%**, autoplay, muted, loop, `playsinline`, poster WebP.
- **Keterbacaan:** gradien Void 80% → transparan dari kiri ke kanan, dan gradien Void dari bawah (160px) agar menyatu dengan section berikutnya.
- **Konten:** kolom tunggal kiri (label, headline, paragraf, CTA). Tidak ada logo di kanan; logo 2D 96px hanya di mobile.
- Hero berlatar Void solid, jadi lapisan ambient tidak terlihat di hero.

### Ambient (di bawah hero)
- Lapisan `fixed` di belakang konten: 40 segitiga 5–10px + 10 kelopak sakura, **opacity 35%**, mengalir kanan→kiri pelan (30–60 detik per lintasan). Tujuannya agar section tidak hitam polos, bukan untuk menarik perhatian.
- Hanya `transform`, tanpa JavaScript.

### Reduced Motion
`prefers-reduced-motion: reduce` → video hero berhenti di poster, tanpa ambient, tanpa marquee partner, tanpa reveal section.

### UI Motion
- Hover tombol: warna 200ms, panah geser 4px.
- Reveal section: fade + translateY 24px, sekali saja saat masuk viewport.
- Drawer keranjang: slide dari kanan 400ms.
- Hanko Badge: saat pertama muncul, "dicap" — scale 1.3 → 1 dan rotate -20° → -8° dalam 300ms.

---

## Video

| Video | Lokasi | Perilaku | Format |
|-------|--------|----------|--------|
| **Showreel esport** | Latar hero (opacity 30%) | Autoplay, muted, loop, `playsinline`; tombol speaker untuk suara; lazy-load saat 200px sebelum masuk viewport; poster frame JPG/WebP | MP4 H.264 ≤ 8 MB (720p, 20–30s) **atau** embed YouTube (lite-youtube) untuk versi penuh |
| **Lookbook Alter Merch** | Store: di atas grid produk; Landing: di atas grid preview merch | Sama, tanpa tombol suara (video senyap) | MP4 ≤ 5 MB, 10–15s |

Hero memakai video yang sama sebagai latar 30% (revisi 2026-10-17). Jangan self-host file > 10 MB. Di mobile, autoplay tetap jalan (muted) dengan versi 480p.

---

## Sitemap & Section Order

### Landing (`/`)

| # | Section | Isi | Komponen |
|---|---------|-----|----------|
| — | Nav | Logo, STORE · ROSTER · NEWS · ACHIEVEMENTS · JOIN, SHOP | Navigation Bar |
| 1 | Hero | Headline + CTA di atas video latar 30% | Hero Headline Block, Hero Background Video |
| 2 | Identitas | Logo bergeser kanan → kiri saat scroll | Logo Slide |
| 3 | Manifesto | Siapa Alter Ego, makna "banyak wajah, satu nama" | Manifesto Block |
| 4 | Roster | Tab divisi: Mobile Legends · Counter-Strike 2 · PUBG Mobile | Roster Card, tab divisi (Tag/Chip) |
| 5 | Alter Merch | Lookbook video + 4–8 produk unggulan + "Lihat Semua" | Showreel Frame (lookbook), Product Card, Secondary Button |
| 6 | Achievements | Angka & pencapaian | Achievement Stat |
| 7 | News | 3 berita terbaru + "Semua Berita" | News Card |
| 8 | Partners | Logo partner | Partner Strip |
| 9 | Join | Sosmed Alter Ego Esports & Alter Merch | Join Block |
| — | Footer | Navigasi, toko per negara, offline store, sosmed | Footer, Seigaiha Texture |

Seigaiha Divider dipakai di antara 3→4, 6→7, dan 8→9.

### Halaman lain

| Route | Isi | Status |
|-------|-----|--------|
| `/store` | Header + seigaiha, lookbook, filter chip (kategori, ukuran), grid Product Card 4 kolom desktop / 2 kolom mobile | Aktif |
| `/store/[slug]` | Product Detail | Aktif |
| `/news` | Featured + grid News Card + filter kategori | Aktif |
| `/news/[slug]` | Article Page | Aktif |
| `/roster` | Semua divisi, Roster Card lengkap | Aktif (opsional; bisa cukup section landing) |
| Cart Drawer | Overlay global | **Disiapkan, nonaktif** sampai `STORE_MODE = "native"` |
| `/checkout` | Checkout Form | **Disiapkan, nonaktif** |
| `/order/[id]` | Order Status | **Disiapkan, nonaktif** |

---

## Store Modes

Satu flag mengatur seluruh perilaku belanja:

```ts
STORE_MODE = "marketplace" | "native"   // sekarang: "marketplace"
```

### Mode A — `marketplace` (sekarang)
- **Primary Button "BELI SEKARANG"** → buka `product.shopeeUrl` di tab baru.
- **Fallback:** selama data per produk belum di-scrape, `shopeeUrl` kosong → arahkan ke toko `https://shopee.co.id/alterego_merch`.
- **Secondary Button "TOKOPEDIA"** → `product.tokopediaUrl`, fallback `https://www.tokopedia.com/alteregomerch`.
- Tidak ada ikon keranjang, Quantity Stepper, drawer, maupun halaman checkout.
- Di bawah tombol: Ghost Link kecil "Belanja dari luar Indonesia?" → membuka daftar Shopee per negara + WhatsApp worldwide.

### Mode B — `native` (MVP berikutnya)
- Pilih varian → **Quantity Stepper** (+/−) → **Primary Button "TAMBAH KE KERANJANG"** → Cart Drawer terbuka.
- Checkout Form → payment gateway (kandidat: Midtrans atau Xendit; ongkir: Biteship atau RajaOngkir — diputuskan saat build) → Order Status.
- Shopee & Tokopedia turun menjadi Ghost Link "Beli lewat marketplace" di bawah tombol.
- Ikon keranjang + jumlah item muncul di Nav.

Area aksi di Product Card dan Product Detail adalah **satu komponen** (`ProductAction`) yang membaca `STORE_MODE`; tata letak kartu tidak berubah antar mode.

### Skema data produk (dipakai kedua mode sejak awal)

```ts
type Product = {
  slug: string;
  name: string;
  category: "jersey" | "hoodie" | "tshirt" | "jacket" | "accessory"; // TODO: konfirmasi kategori asli
  price: number;            // IDR
  compareAtPrice?: number;  // harga coret
  images: string[];
  badge?: "NEW" | "LIMITED" | "SOLD OUT" | "PRE-ORDER";
  variants: { id: string; size?: string; color?: string; stock: number }[];
  shopeeUrl?: string;       // kosong → fallback toko Shopee
  tokopediaUrl?: string;    // kosong → fallback toko Tokopedia
  description: string;
};
```

---

## Konten & Link

### Toko & belanja
| Label | URL |
|-------|-----|
| Shopee Indonesia (utama) | https://shopee.co.id/alterego_merch |
| Tokopedia | https://www.tokopedia.com/alteregomerch |
| Shopee Philippines | https://shopee.ph/alteregomerchtc.ph |
| Shopee Malaysia | https://shopee.com.my/alteregomerch7q.my |
| Shopee Singapore | https://shopee.sg/alteregomerchuq.sg |
| Shopee Vietnam | https://shopee.vn/alteregomerchcn.vn |
| Shopee Thailand | https://shopee.co.th/alteregomerchfy.th |
| WhatsApp (Worldwide Shipping) | https://wa.me/6289652442519 |
| Offline store | Milestones Coffee, Jakarta Barat — https://www.google.com/maps/place/Milestones+Coffee+-+Jakarta+Barat/@-6.1973533,106.7648184,17z |
| Linktree lengkap | https://linktr.ee/AlterEgoesports |

### Sosial media
| Grup | Akun | URL |
|------|------|-----|
| Alter Ego Esports | Instagram @alteregoesports | https://www.instagram.com/alteregoesports/ |
| Alter Merch | Instagram @altermerch.id | https://www.instagram.com/altermerch.id/ |
| — | TikTok, YouTube, X, Discord | TODO: isi bila ada |

### Roster (contoh awal)
| Nickname | Nama | Negara | Role | Game | Status |
|----------|------|--------|------|------|--------|
| NINO | Syauki Fauzan Sumarno | Indonesia | EXP Laner | Mobile Legends | Active |
| — | Slot "SOON" × 4 | | | | Diisi nanti dari Liquipedia |

### Partners
Goodday Coffee · Interbat · CBN Fiber · myBCA · Supreme League · Interlac.
Gunakan logo resmi versi monokrom; konfirmasi izin pemakaian logo sebelum rilis.

### Achievements
Placeholder sampai data diverifikasi dari sumber resmi.

---

## Do's and Don'ts

### Do
- Pakai `#000000` untuk semua latar section; permukaan Ink hanya di Store, Produk, drawer, dan form.
- Tulis semua headline dengan Anton UPPERCASE, line-height 0.90–0.95.
- Pakai Chakra Petch 400 18px untuk paragraf, line-height 1.6.
- Pakai Ego Red `#CC1510` untuk latar tombol utama dan Signal Red `#EE2B20` untuk teks merah kecil.
- Batasi satu Primary Button merah per viewport.
- Buat semua gerak dekoratif (partikel, kelopak, marquee) mengalir dari kanan ke kiri.
- Awali setiap section dengan Section Label bernomor Mono.
- Hormati `prefers-reduced-motion` dan matikan 3D di bawah 1024px.

### Don't
- Jangan pakai merah sebagai latar section atau blok besar.
- Jangan pakai gradien di komponen UI — gradien hanya untuk logo, partikel, dan rim-light.
- Jangan pakai shadow / elevation di mana pun.
- Jangan pakai kartu berlatar di landing (Roster, News, Manifesto tetap melayang di atas void). Kartu hanya Product Card.
- Jangan pakai huruf kana atau kanji; unsur Jepang cukup sakura, seigaiha, dan bentuk hanko.
- Jangan pakai ornamen Jepang lain (torii, kipas, gunung Fuji, ombak besar ala Hokusai) — terasa seperti kostum.
- Jangan taruh video hero di atas 30% opacity atau tanpa gradien; judul harus selalu terbaca.
- Jangan muat `.glb` > 3 MB, dan jangan memuat Three.js di mobile.
- Jangan pakai warna di luar palet, termasuk hijau untuk "sukses".
- Jangan set Anton di bawah 28px atau dalam huruf kecil.

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Semua latar halaman dan section |
| 1 | Ink | `#0D0D0D` | Product Card, latar video sebelum dimuat |
| 2 | Ink Raised | `#161616` | Drawer, input, dropdown, panel checkout |
| — | Ego Red | `#CC1510` | Tombol utama saja |

## Elevation
Flat. Tidak ada `box-shadow` untuk kedalaman. Pemisahan dicapai lewat lompatan permukaan (Void → Ink → Ink Raised), garis Hairline 1px, dan skala tipografi. Satu-satunya "cahaya" adalah rim-light merah pada logo 3D.

## Imagery
- Tidak ada objek 3D di situs (revisi 2026-10-17). Model logo 3D tetap tersedia di `brand/` untuk keperluan lain.
- **Foto pemain:** potret latar gelap/hitam, pencahayaan dramatis dari samping, ditampilkan grayscale dan berwarna saat hover.
- **Foto produk:** latar `#161616` polos atau flat-lay di atas hitam, pencahayaan rata; foto kedua = model memakai produk.
- **Foto berita:** foto pertandingan/event, crop 16:9.
- **Ikon:** monoline 1.5px (Lucide atau serupa), warna Bone/Ash.
- Tanpa ilustrasi kartun, stok foto generik, atau AI-art.

## Layout
Full-bleed hitam dengan konten maks 1280px di tengah. Hero split 6/6. Section berselang-seling komposisi kiri-kanan (zigzag, gaya Dala). Store dan News memakai grid. Ritme vertikal 96–128px antar section desktop, 64px mobile. Nav sticky; tidak ada sidebar.

---

## Agent Prompt Guide

### Quick Color Reference
- Background: `#000000`
- Card / input: `#0D0D0D` / `#161616`
- Border: `#262626`
- Text: `#FFFFFF` (primer), `#9A9A9A` (sekunder), `#BDBDBD` (tersier)
- Primary action: `#CC1510` (hover `#E01A12`)
- Red text / accent: `#EE2B20`

### Example Component Prompts

1. **Hero (desktop):** Latar `#000000` full-viewport. Kolom kiri: label JetBrains Mono 12px UPPERCASE `#9A9A9A` "ALTER EGO ESPORTS · EST. 2018"; headline Anton 128px UPPERCASE line-height 0.9 `#FFFFFF` "WEAR / YOUR / ALTER EGO"; paragraf Chakra Petch 400 18px `#BDBDBD` maks 440px; tombol `#CC1510` teks putih Chakra Petch 600 14px UPPERCASE, radius 8px, padding 16×24px "SHOP ALTER MERCH". Kolom kanan: kanvas Three.js berisi aliran partikel segitiga putih/merah/abu dan kelopak sakura yang bergerak kanan→kiri lalu berkumpul membentuk logo 3D perisai tiga-topeng.

2. **Hero (mobile):** Tanpa 3D. Logo PNG 96px, label Mono, headline Anton 72px memenuhi lebar, garis seigaiha 1px putih 8% di bawahnya, 12 kelopak SVG CSS mengalir kanan→kiri, tombol merah full-width.

3. **Product Card (mode marketplace):** Latar `#0D0D0D`, radius 24px, padding 16px, tanpa shadow. Foto 1:1 radius 16px, badge hanko "NEW" lingkaran 56px border 2px `#EE2B20` diputar -8° di sudut kanan-atas. Nama Chakra Petch 500 16px putih, harga Chakra Petch 500 18px. Tombol penuh `#CC1510` "BELI SEKARANG" → Shopee; tombol outline putih 40% "TOKOPEDIA".

4. **Roster Card:** Tanpa latar. Foto 3:4 radius 24px grayscale, berwarna saat hover. Label Mono 12px `#EE2B20` "EXP LANER · MOBILE LEGENDS", nickname Anton 40px "NINO", nama Chakra Petch 400 16px `#9A9A9A` "Syauki Fauzan Sumarno".

5. **Cart Drawer (mode native):** Panel kanan 440px latar `#161616`, radius 32px sudut kiri. Item dengan thumbnail 72px, Quantity Stepper (−/angka/+, tinggi 48px, radius 8px, border `#262626`), subtotal, tombol `#CC1510` "CHECKOUT".

## Similar Brands
- **Riot Games** — crimson tunggal di atas near-black, display tegas untuk esport.
- **ASUS ROG** — merah-hitam teknikal, gaming hardware Asia.
- **Linear / Vercel** — void hitam sebagai material desain, satu aksen.
- **Dala** — partikel sebagai identitas brand.
- **Dayos** — headline kondensed UPPERCASE, label mono, permukaan flat.

---

## Quick Start

### CSS Custom Properties

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Chakra+Petch:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Colors */
  --color-void: #000000;
  --color-ink: #0D0D0D;
  --color-ink-raised: #161616;
  --color-hairline: #262626;
  --color-bone: #FFFFFF;
  --color-ash: #9A9A9A;
  --color-silver: #BDBDBD;
  --color-ego-red: #CC1510;
  --color-ego-red-hover: #E01A12;
  --color-signal-red: #EE2B20;
  --color-blood: #7A0A0E;
  --gradient-logo: linear-gradient(135deg, #EE2B20 0%, #7A0A0E 100%); /* logo & partikel saja */

  /* Fonts */
  --font-display: 'Anton', 'Barlow Condensed', 'Bebas Neue', Impact, sans-serif;
  --font-body: 'Chakra Petch', 'Barlow', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;

  /* Type scale (fluid) */
  --text-label: clamp(11px, 0.8vw, 12px);
  --text-caption: clamp(13px, 1vw, 14px);
  --text-ui: clamp(15px, 1.1vw, 16px);
  --text-body: clamp(16px, 1.3vw, 18px);
  --text-subheading: clamp(20px, 1.8vw, 24px);
  --text-heading-sm: clamp(28px, 3vw, 40px);
  --text-heading: clamp(40px, 4.4vw, 56px);
  --text-display: clamp(56px, 6.9vw, 88px);
  --text-display-xl: clamp(72px, 10vw, 128px);

  --leading-display: 0.9;
  --leading-heading: 0.95;
  --leading-body: 1.6;
  --tracking-display: -0.01em;
  --tracking-label: 0.06em;
  --tracking-ui: 0.04em;

  /* Weights */
    --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --space-4: 4px;
  --space-8: 8px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-48: 48px;
  --space-64: 64px;
  --space-96: 96px;
  --space-128: 128px;

  /* Radius */
  --radius-control: 8px;
  --radius-card: 24px;
  --radius-panel: 32px;
  --radius-pill: 9999px;

  /* Layout */
  --page-max-width: 1280px;
  --gutter: 24px;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 400ms;
}

@media (max-width: 767px) {
  :root { --gutter: 16px; }
}

body {
  background: var(--color-void);
  color: var(--color-bone);
  font-family: var(--font-body);
  font-weight: var(--font-weight-regular);
  font-size: var(--text-body);
  line-height: var(--leading-body);
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-ink: #0D0D0D;
  --color-ink-raised: #161616;
  --color-hairline: #262626;
  --color-bone: #FFFFFF;
  --color-ash: #9A9A9A;
  --color-silver: #BDBDBD;
  --color-ego-red: #CC1510;
  --color-ego-red-hover: #E01A12;
  --color-signal-red: #EE2B20;
  --color-blood: #7A0A0E;

  /* Fonts */
  --font-display: 'Anton', 'Barlow Condensed', 'Bebas Neue', Impact, sans-serif;
  --font-body: 'Chakra Petch', 'Barlow', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;

  /* Type scale */
  --text-label: 12px;
  --text-caption: 14px;
  --text-ui: 16px;
  --text-body: 18px;
  --text-subheading: 24px;
  --text-heading-sm: 40px;
  --text-heading: 56px;
  --text-display: 88px;
  --text-display-xl: 128px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Radius */
  --radius-control: 8px;
  --radius-card: 24px;
  --radius-panel: 32px;
  --radius-pill: 9999px;

  /* Breakpoints */
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## Catatan & TODO sebelum build
- [ ] Kompres `alterego_logo.glb` (127 MB) ke ≤ 3 MB dan siapkan render statis WebP untuk reduced-motion.
- [ ] Scrape/isi `shopeeUrl` & `tokopediaUrl` per produk (sementara pakai fallback toko).
- [ ] Konfirmasi kategori produk dan siapkan foto produk.
- [ ] Isi roster lengkap dari Liquipedia (sekarang: NINO + 4 slot SOON) — prompt & skema JSON di `data/PROMPTS_ROSTER_ACHIEVEMENT.md`.
- [ ] Verifikasi data achievements dari sumber resmi — prompt & skema JSON di file yang sama.
- [ ] Minta logo resmi + izin pemakaian dari 6 partner.
- [ ] Siapkan file video showreel (≤ 8 MB) & lookbook (≤ 5 MB) + poster frame.
- [ ] Lengkapi sosmed lain (TikTok, YouTube, X, Discord) bila ada.
- [ ] Mode `native`: pilih payment gateway & penyedia ongkir.

### Referensi
- `DESIGN (3).md` — Dala (void, partikel, body ringan)
- `DESIGN (4).md` — Dayos (kondensed UPPERCASE, label mono, flat)
- Riot Games & ASUS ROG DESIGN.md — https://www.webdesignhot.com/design.md/riot-games/ · https://www.webdesignhot.com/design.md/asus/
- awesome-design-md-jp — https://www.skills.sh/aradotso/trending-skills/awesome-design-md-jp
- Linktree resmi — https://linktr.ee/AlterEgoesports
