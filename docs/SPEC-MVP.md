# SPEC — Website Alter Ego (MVP awal + tahapan implementasi)

**Status:** ready-for-agent
**Tanggal:** 2026-10-16
**Acuan desain:** `DESIGN.md` (sumber kebenaran visual: token, komponen, motion, sitemap, Store Modes)
**Acuan data:** `data/` (roster, achievement, produk, video, link sosmed) dan `data/PROMPTS_ROSTER_ACHIEVEMENT.md` (skema)

---

## Problem Statement

Alter Ego Esports dan Alter Merch belum punya rumah digital sendiri. Penggemar yang ingin tahu roster terbaru, pencapaian tim, berita pertandingan, atau ingin membeli jersey harus melompat-lompat antara Linktree, Instagram, Liquipedia, Shopee, dan Tokopedia. Tidak ada satu tempat yang menampilkan identitas brand (hitam–merah–putih, topeng tiga wajah) secara utuh, dan tidak ada jalur belanja yang terasa "milik Alter Ego". Data roster (MLBB, CS2, PUBG Mobile), 25 achievement, 85 produk aktif, dan video highlight sudah terkumpul, tetapi belum ditampilkan di mana pun.

## Solution

Situs satu-pintu yang dibangun bertahap. **MVP awal** adalah situs statis yang cepat berisi landing page lengkap, halaman Store dan Produk dengan tombol **"Beli Sekarang"** yang mengarah ke Shopee (Store Mode `marketplace`), halaman Berita, serta hero 3D berpartikel di desktop. Seluruh konten dibaca dari file data di repo melalui satu lapisan katalog, sehingga memperbarui roster, achievement, produk, atau berita cukup dengan mengganti file data. Arsitektur sudah menyiapkan Store Mode `native` (keranjang, stepper qty, checkout, payment gateway) sebagai tahap setelah MVP tanpa perlu mendesain ulang.

---

## Scope MVP awal

MVP = **Fase 0 sampai Fase 5** di bawah, sudah dideploy di domain publik.

| Masuk MVP | Tidak masuk MVP |
|-----------|-----------------|
| Landing 10 section sesuai `DESIGN.md` | Keranjang, stepper qty, checkout, payment gateway (Fase 6) |
| Store (85 produk) + halaman Produk, mode `marketplace` | Akun pengguna / login |
| Tombol "Beli Sekarang" → Shopee (fallback toko), Tokopedia sekunder, toko per negara + WhatsApp | Link Shopee per produk (menunggu scraping; pakai fallback) |
| Roster 3 game (tab MLBB · CS2 · PUBG Mobile), divisi Alter Ego & Alter Ego Ares | Halaman profil per pemain |
| Achievement: angka ringkasan + daftar highlight | Halaman achievement penuh dengan filter |
| Berita: daftar + artikel, konten Markdown, 3 artikel awal | CMS (Sanity/Strapi) |
| Showreel video + poster | Galeri media / VOD |
| Hero 3D + partikel kanan→kiri + sakura (desktop ≥1024px) | 3D di mobile/tablet |
| Hero tipografi + kelopak CSS (mobile), reduced-motion | Multi-bahasa (EN) |
| Partner strip (6 partner, wordmark sementara bila logo belum ada) | Dashboard admin |
| SEO dasar, OG image, sitemap, Lighthouse mobile >80 | Analytics lanjutan, A/B test |

---

## Tahapan & Definition of Done

Setiap fase harus bisa dideploy sendiri (situs tetap utuh setelah fase selesai). DoD umum yang berlaku di **semua** fase:
- Build lulus tanpa error dan tanpa warning tipe.
- Semua tes di seam yang relevan lulus.
- Tidak ada warna, font, atau radius di luar token `DESIGN.md`.
- Diperiksa di lebar 375px, 768px, 1280px, 1920px.

### Fase 0 — Fondasi & aset
Isi: inisialisasi proyek + git, token desain dari `DESIGN.md` jadi tema (CSS variables / Tailwind v4), font (Anton, Inter, JetBrains Mono), layout dasar (Nav + Footer kosong), pipeline aset, deploy preview otomatis.

**DoD**
- [ ] Repo git terinisialisasi; file mentah besar (`alterego_logo_1.glb` 127 MB, video mentah 34–70 MB, `.blend`) dikecualikan dari repo/deploy.
- [ ] Halaman kosong ber-Nav + Footer tampil dengan latar `#000`, font benar, di URL preview publik.
- [ ] Token warna/tipografi/spacing/radius identik dengan Quick Start `DESIGN.md`.
- [ ] `alterego_logo_optimized.glb` (1.5 MB) dipakai sebagai aset logo 3D; ukuran ≤ 3 MB terverifikasi.
- [ ] Showreel siap web: MP4 + WebM ≤ 8 MB masing-masing (re-encode `highlight-reel` yang sekarang 9.5 MB), versi 480p untuk mobile, poster JPG/WebP.
- [ ] Gambar produk diunduh dari CDN Shopee dan disimpan lokal dalam ukuran teroptimasi (WebP, lebar 400/800/1200), tidak hotlink.

### Fase 1 — Lapisan katalog (data)
Isi: modul katalog yang membaca semua file data mentah dan mengembalikan objek domain yang sudah dinormalisasi (Player, Achievement, AchievementSummary, Product, NewsArticle, Partner, SocialLink, StoreLink).

**DoD**
- [ ] Roster: 29 entri dari 3 game termuat; diurutkan per `game` → `division` → `displayOrder`; staff terpisah dari pemain; `photo: null` → penanda placeholder.
- [ ] Achievement: 25 entri termuat, urut terbaru dulu; `summary` yang bernilai `null` (PUBG Mobile) dihitung ulang dari daftar achievement; `totalPrizeUSD` digabung lintas game untuk angka landing.
- [ ] Highlight landing: maks 6 entri `highlight: true` terbaru lintas game.
- [ ] Produk: 85 entri; `harga` string ("Rp585.000", "Rp325.000 - Rp335.000") → `priceMin`/`priceMax` angka IDR; slug unik dari nama; kategori diturunkan dari nama (jersey, hoodie, jacket/tracktop, tshirt, accessory, other); gambar duplikat ukuran (`_tn`, `resize_w164`) dibuang, satu set gambar resolusi tertinggi tersisa; `shopeeUrl` kosong → fallback toko; `tokopediaUrl` kosong → fallback toko.
- [ ] Deskripsi produk yang memakai pemisah ` | ` dipecah jadi paragraf/daftar yang bisa dirender.
- [ ] Link sosmed & toko (Instagram ×2, TikTok, YouTube, X, Shopee ×6 negara, Tokopedia, WhatsApp, offline store) tersedia dari satu sumber.
- [ ] Entri data rusak (field wajib hilang) membuat build gagal dengan pesan yang menyebut file + entri, bukan halaman kosong diam-diam.
- [ ] Tes katalog lulus (lihat Testing Decisions).

### Fase 2 — Landing page (tanpa 3D)
Isi: semua section landing sesuai `DESIGN.md` → Sitemap, dengan hero versi tipografi dipakai di semua ukuran layar dulu.

**DoD**
- [ ] Urutan section: Nav, Hero, Showreel, Manifesto, Roster, Alter Merch, Achievements, News, Partners, Join, Footer.
- [ ] Showreel autoplay muted loop `playsinline`, lazy-load, tombol suara berfungsi, poster tampil sebelum video dimuat.
- [ ] Roster: tab MLBB · CS2 · PUBG Mobile bisa dioperasikan keyboard; tiap tab menampilkan divisi (Alter Ego, Alter Ego Ares) dan staff; foto kosong → siluet topeng.
- [ ] Alter Merch: lookbook + 8 produk unggulan + "Lihat Semua" ke Store.
- [ ] Achievements: angka ringkasan per game + daftar highlight.
- [ ] News: 3 artikel terbaru.
- [ ] Partners: 6 partner, marquee kanan→kiri desktop, grid statis mobile, berhenti saat hover.
- [ ] Join & Footer: dua grup sosmed, toko per negara, WhatsApp worldwide, alamat offline store.
- [ ] Seigaiha divider di 3→4, 6→7, 8→9; tekstur 4% di footer.
- [ ] Satu Primary Button merah per viewport (dicek manual di 4 lebar layar).
- [ ] Kontras teks lolos WCAG AA; semua gambar punya `alt`; landmark & heading berurutan.

### Fase 3 — Store, Produk, Berita (mode `marketplace`)
Isi: halaman Store (grid + filter kategori), halaman Produk, halaman daftar Berita, halaman Artikel, komponen `ProductAction` yang membaca Store Mode.

**DoD**
- [ ] Store menampilkan 85 produk, grid 4 kolom desktop / 2 kolom mobile, filter kategori (chip) bekerja dan tercermin di URL.
- [ ] Setiap produk punya halaman sendiri (galeri, harga/rentang harga, deskripsi terformat, accordion), dapat diakses lewat slug.
- [ ] `ProductAction` mode `marketplace`: Primary "BELI SEKARANG" membuka Shopee di tab baru (`rel="noopener"`), Secondary "TOKOPEDIA", Ghost Link "Belanja dari luar Indonesia?" membuka daftar Shopee per negara + WhatsApp. Tidak ada ikon keranjang di Nav.
- [ ] Mobile: area aksi menempel di bawah layar pada halaman Produk.
- [ ] Mengganti Store Mode ke `native` saat build tidak merusak build (komponen native boleh berupa placeholder "segera hadir").
- [ ] Berita: 3 artikel Markdown awal dari materi yang ada (PMPL ID 2026 Fall — Alter Ego Ares juara; M7 — runner-up; AFK Masters Cup — juara), dengan gambar dari `data/`; daftar berita + filter kategori; artikel dengan "Berita Lainnya".
- [ ] Menambah artikel baru cukup dengan menambah satu file Markdown (diverifikasi dengan artikel uji).

### Fase 4 — Hero 3D & motion (desktop)
Isi: kanvas WebGL di hero desktop: aliran partikel kanan→kiri, kelopak sakura, morph ke logo 3D, interaksi kursor & scroll; ambient particle di bawah hero; kelopak CSS di mobile; reduced-motion.

**DoD**
- [ ] Hanya dimuat di ≥1024px dan tanpa `prefers-reduced-motion`; di mobile/tablet Three.js dan `.glb` **tidak diunduh sama sekali** (diverifikasi di tab Network).
- [ ] Partikel (±5.000) + sakura (±80) mengalir kanan→kiri, berkumpul membentuk logo, terlepas sebagian, kembali, sesuai `DESIGN.md` → Motion.
- [ ] Logo 2D PNG tampil sebagai placeholder sampai `.glb` selesai dimuat; hero tetap terbaca bila WebGL gagal.
- [ ] Render loop berhenti saat hero di luar viewport.
- [ ] Reduced-motion: tanpa partikel/kelopak/marquee/reveal; desktop menampilkan render statis logo.
- [ ] Desktop stabil ≥ 50 fps di laptop kelas menengah (iGPU) pada 1920×1080.

### Fase 5 — Kualitas & rilis MVP
Isi: SEO, OG image, sitemap, favicon, halaman 404, audit performa & aksesibilitas, deploy produksi.

**DoD**
- [ ] Lighthouse mobile: Performance > 80, Accessibility > 90, SEO > 90 untuk Landing, Store, Produk, Artikel.
- [ ] Meta title/description per halaman, OG image per produk & artikel, `sitemap.xml`, `robots.txt`.
- [ ] Halaman 404 bergaya brand.
- [ ] Semua link eksternal (Shopee ×6, Tokopedia, WhatsApp, sosmed ×5, Maps) diverifikasi tidak 404.
- [ ] Seluruh tes seam lulus di pipeline sebelum deploy produksi.
- [ ] Situs live di domain produksi; checklist TODO `DESIGN.md` yang tersisa dicatat sebagai backlog.

### Fase 6 — Store Mode `native` (setelah MVP, tidak masuk MVP)
Isi: varian & stok per produk, Quantity Stepper, Cart Drawer, Checkout Form, integrasi payment gateway (kandidat Midtrans/Xendit) dan ongkir (Biteship/RajaOngkir), Order Status.

**DoD (garis besar, dirinci di spec terpisah)**
- [ ] Data produk punya `variants` + `stock`; stepper membatasi qty 1..stock.
- [ ] Keranjang bertahan antar halaman dan reload.
- [ ] Checkout membuat transaksi di gateway (sandbox lalu produksi) dan menampilkan Order Status PAID/PENDING/FAILED.
- [ ] Mengganti flag ke `native` mengaktifkan semua elemen tanpa mengubah tata letak kartu produk.

---

## User Stories

### Pengunjung umum / penggemar
1. As a penggemar, I want langsung melihat identitas Alter Ego (logo, warna, headline) saat membuka situs, so that saya yakin ini situs resmi.
2. As a penggemar di desktop, I want melihat logo 3D yang dibentuk partikel mengalir, so that situs terasa premium dan berbeda dari Linktree.
3. As a penggemar di HP, I want halaman tetap cepat dan ringan tanpa 3D, so that saya tidak menunggu lama atau menghabiskan kuota.
4. As a pengunjung yang sensitif terhadap gerakan, I want animasi berhenti saat saya mengaktifkan reduced-motion, so that saya nyaman membaca.
5. As a penggemar, I want menonton showreel highlight tim langsung di landing, so that saya merasakan atmosfer pertandingan.
6. As a penggemar, I want menyalakan suara showreel dengan satu klik, so that saya bisa mendengar caster dan sorakan.
7. As a penggemar, I want membaca manifesto singkat Alter Ego, so that saya memahami arti nama dan nilai tim.
8. As a penggemar MLBB, I want melihat roster MLBB aktif beserta role tiap pemain, so that saya tahu siapa yang bertanding.
9. As a penggemar CS2, I want berpindah ke tab CS2, so that saya melihat roster CS2 tanpa meninggalkan halaman.
10. As a penggemar PUBG Mobile, I want melihat roster Alter Ego Ares, so that saya mengenal tim yang juara PMPL.
11. As a penggemar, I want staff (coach, analyst, manager) ditampilkan terpisah dari pemain, so that saya tahu struktur tim.
12. As a penggemar, I want melihat negara asal pemain, so that saya tahu pemain impor dan lokal.
13. As a penggemar, I want angka besar pencapaian (gelar, runner-up, partisipasi internasional, total hadiah), so that saya bangga dengan rekam jejak tim.
14. As a penggemar, I want melihat daftar pencapaian terpenting terbaru, so that saya tahu prestasi terkini.
15. As a penggemar, I want membaca berita terbaru di landing, so that saya mengikuti perkembangan tim.
16. As a penggemar, I want membuka halaman Berita dan memfilter per kategori (MATCH, RESULT, MERCH, ROSTER), so that saya menemukan berita yang saya cari.
17. As a penggemar, I want membaca artikel lengkap dengan gambar, so that saya mendapatkan cerita di balik hasil pertandingan.
18. As a penggemar, I want rekomendasi "Berita Lainnya" di akhir artikel, so that saya terus membaca.
19. As a penggemar, I want melihat partner resmi tim, so that saya tahu brand yang mendukung Alter Ego.
20. As a penggemar, I want link ke Instagram, TikTok, YouTube, dan X Alter Ego Esports, so that saya bisa mengikuti tim di platform favorit saya.
21. As a penggemar merch, I want link ke Instagram Alter Merch terpisah, so that saya mengikuti rilis produk.
22. As a pengunjung, I want navigasi yang selalu terlihat saat scroll, so that saya bisa berpindah section kapan saja.
23. As a pengunjung HP, I want menu full-screen yang mudah disentuh, so that navigasi nyaman dengan satu tangan.
24. As a pengunjung keyboard / screen reader, I want semua tab, tombol, dan link bisa diakses dan diberi label, so that saya bisa memakai situs tanpa mouse.
25. As a pengunjung yang membuka link rusak, I want halaman 404 bergaya brand dengan jalan kembali, so that saya tidak tersesat.
26. As a pengunjung yang membagikan link, I want pratinjau (OG image, judul) yang menarik di WhatsApp/X, so that teman saya tertarik membuka.

### Pembeli merch
27. As a pembeli, I want melihat produk unggulan di landing, so that saya tertarik berbelanja tanpa mencari.
28. As a pembeli, I want membuka Store dan melihat semua 85 produk aktif, so that saya mengetahui seluruh koleksi.
29. As a pembeli, I want memfilter produk per kategori (jersey, hoodie, jaket, kaos, aksesori), so that saya cepat menemukan yang saya mau.
30. As a pembeli, I want filter tersimpan di URL, so that saya bisa membagikan atau kembali ke hasil yang sama.
31. As a pembeli, I want melihat harga atau rentang harga yang jelas dalam Rupiah, so that saya tahu biayanya.
32. As a pembeli, I want melihat foto kedua produk saat hover, so that saya membayangkan produk dipakai.
33. As a pembeli, I want halaman produk dengan galeri, deskripsi bahan, tabel ukuran, dan isi paket, so that saya yakin sebelum membeli.
34. As a pembeli, I want tombol "Beli Sekarang" yang membawa saya ke Shopee resmi, so that saya bisa checkout dengan metode yang sudah saya percaya.
35. As a pembeli yang lebih suka Tokopedia, I want tombol Tokopedia, so that saya berbelanja di marketplace pilihan saya.
36. As a pembeli dari Filipina/Malaysia/Singapura/Vietnam/Thailand, I want link ke Shopee negara saya, so that ongkir dan mata uangnya sesuai.
37. As a pembeli dari luar Asia Tenggara, I want kontak WhatsApp untuk pengiriman worldwide, so that saya tetap bisa membeli.
38. As a pembeli di Jakarta, I want alamat offline store dengan link Maps, so that saya bisa mencoba langsung.
39. As a pembeli di HP, I want tombol beli selalu terlihat di bawah layar halaman produk, so that saya tidak perlu scroll balik.
40. As a pembeli, I want tahu produk berstatus NEW / LIMITED / SOLD OUT lewat badge, so that saya tidak kehabisan.

### Pembeli (setelah MVP, mode `native`)
41. As a pembeli, I want menambahkan produk ke keranjang langsung di situs, so that saya membeli beberapa barang sekaligus.
42. As a pembeli, I want mengatur jumlah dengan tombol + dan −, so that saya membeli lebih dari satu dengan mudah.
43. As a pembeli, I want keranjang saya tetap ada saat pindah halaman atau reload, so that saya tidak kehilangan pilihan.
44. As a pembeli, I want checkout dengan QRIS, virtual account, atau e-wallet, so that saya membayar dengan cara yang biasa saya pakai.
45. As a pembeli, I want melihat ongkir sebelum membayar, so that tidak ada biaya kejutan.
46. As a pembeli, I want halaman status pesanan setelah bayar, so that saya tahu pesanan diterima.

### Tim Alter Ego (pengelola konten)
47. As an admin konten, I want memperbarui roster dengan mengganti satu file JSON, so that perubahan transfer pemain cepat tayang.
48. As an admin konten, I want menambah achievement baru di file JSON dan angka ringkasan ikut terhitung, so that saya tidak menghitung manual.
49. As an admin konten, I want build gagal dengan pesan jelas jika data saya salah format, so that situs tidak tayang dengan halaman kosong.
50. As an admin konten, I want menulis berita sebagai file Markdown, so that saya tidak butuh CMS untuk mulai.
51. As an admin konten, I want menandai achievement `highlight` untuk muncul di landing, so that saya mengkurasi apa yang ditonjolkan.
52. As an admin konten, I want menambahkan foto pemain cukup dengan mengisi path `photo`, so that placeholder otomatis tergantikan.
53. As an admin konten, I want memperbarui daftar produk dari hasil scraping Shopee terbaru, so that toko di situs selalu sinkron.
54. As an admin konten, I want mengisi link Shopee per produk nanti tanpa mengubah tampilan, so that tombol langsung ke produk, bukan ke toko.
55. As an admin konten, I want mengganti logo partner wordmark dengan logo resmi cukup dengan menambah file, so that strip partner terlihat profesional.
56. As a pemilik brand, I want mengaktifkan checkout native dengan satu flag saat MVP berikutnya siap, so that tidak perlu desain ulang.
57. As a pemilik brand, I want situs tetap cepat (Lighthouse mobile > 80), so that pengunjung tidak kabur dan SEO baik.
58. As a pemilik brand, I want situs mudah ditemukan di Google untuk "Alter Ego Esports" dan "jersey Alter Ego", so that trafik organik naik.

---

## Implementation Decisions

### Stack
- **Monorepo** (npm workspaces): aplikasi web Astro, aplikasi API NestJS (dibuat di Fase 6), paket tipe bersama (Product, Player, Achievement, NewsArticle) dipakai keduanya.
- **Astro + TypeScript** sebagai framework situs: output statis untuk MVP (cepat, ramah SEO, konten Markdown/JSON lewat content collections + validasi Zod).
- **NestJS** sebagai backend API mulai Fase 6 (produk/stok, keranjang, order, webhook payment, ongkir) dengan **PostgreSQL + Prisma**; Redis + BullMQ opsional untuk antrian webhook/email. Lapisan katalog web dirancang agar sumbernya bisa diganti dari file JSON ke API NestJS tanpa mengubah halaman.
- **Aset:** Sharp (gambar → WebP), ffmpeg (video), gltf-transform (glb).
- **Tes:** Vitest (katalog), Playwright (E2E).
- **Tailwind CSS v4** dengan blok `@theme` dari `DESIGN.md` → Quick Start sebagai satu-satunya sumber token.
- **Three.js** hanya di satu island hero, dimuat dinamis setelah pengecekan lebar layar ≥1024px dan tanpa reduced-motion. Partikel memakai satu `InstancedMesh`; titik target morph disampel dari permukaan `.glb`.
- **Hosting:** Vercel atau Netlify (preview per commit, produksi dari branch utama).
- **Bahasa UI:** Indonesia.

### Modul
1. **Katalog (deep module, seam utama).** Satu antarmuka sempit untuk seluruh konten situs. Konsumen (halaman/komponen) tidak pernah membaca file data mentah. Kemampuan yang diekspos:
   - roster per game (dikelompokkan per divisi, pemain & staff terpisah, terurut),
   - achievement per game + ringkasan per game + ringkasan gabungan + highlight landing (maks 6),
   - daftar produk, produk per slug, produk unggulan, kategori yang tersedia,
   - artikel berita (daftar, per slug, terkait),
   - partner, link sosmed, link toko (per negara), info offline store.
   Di dalamnya: validasi skema (gagal build bila rusak), normalisasi harga, penurunan kategori, deduplikasi gambar, fallback URL marketplace, perhitungan ulang ringkasan yang `null`.
2. **Store Mode & ProductAction.** Konfigurasi `STORE_MODE = "marketplace" | "native"` dibaca saat build. Satu fungsi murni memetakan (produk, mode) → deskriptor aksi (aksi primer, aksi sekunder, link tambahan, apakah keranjang terlihat). Komponen `ProductAction` hanya merender deskriptor itu, dipakai di Product Card dan Product Detail.
3. **Komponen UI** sesuai daftar Components di `DESIGN.md` (Nav, tombol, Section Label, Hanko Badge, Tag, Seigaiha, Roster Card, Product Card, News Card, Achievement Stat, Partner Strip, Join Block, Footer, Showreel Frame). Komponen murni presentasional, menerima objek domain dari katalog.
4. **Hero Motion (island).** Dua implementasi di balik satu titik pemasangan: `HeroWebGL` (desktop) dan `HeroTypographic` (mobile/reduced-motion/WebGL gagal). Keputusan dipilih di klien; `HeroTypographic` selalu dirender di server sebagai baseline sehingga konten tetap ada tanpa JavaScript.
5. **Pipeline aset (skrip build-time, bukan runtime).** Mengunduh dan mengoptimasi gambar produk dari CDN Shopee ke WebP multi-ukuran; memvalidasi ukuran `.glb` ≤ 3 MB dan video ≤ 8 MB.

### Skema domain (tipe yang dihasilkan katalog)
Bentuk mentah mengikuti `data/PROMPTS_ROSTER_ACHIEVEMENT.md`. Tambahan/perubahan hasil normalisasi:
- **Product (dari `alterego_produk_aktif_gambar.json`):** `slug`, `name`, `category`, `priceMin`, `priceMax` (IDR, angka), `images` (terdeduplikasi, resolusi tertinggi), `descriptionBlocks` (hasil pecah pemisah ` | `), `badge?`, `shopeeUrl` (fallback `https://shopee.co.id/alterego_merch`), `tokopediaUrl` (fallback `https://www.tokopedia.com/alteregomerch`). Field `variants`/`stock` opsional dan baru dipakai di Fase 6.
- **AchievementSummary:** `titles`, `runnerUps`, `internationalAppearances`, `totalPrizeUSD`; nilai `null` di file dihitung dari daftar achievement (titles = placement "1", runnerUps = placement "2", total hadiah = jumlah `prize` dalam USD).
- **Division:** nilai bebas dari data (saat ini `Alter Ego`, `Alter Ego Ares`); urutan tampil: `Alter Ego` dulu, lalu alfabet.
- **NewsArticle (frontmatter Markdown):** `title`, `slug`, `date`, `category` (MATCH | RESULT | MERCH | ROSTER), `cover`, `excerpt`, `game?`, `relatedAchievementId?`.
- **SocialLink / StoreLink:** label, URL, grup (`alterego-esports` | `alter-merch` | `marketplace` | `contact`), negara (untuk Shopee).

### Keputusan konten
- Showreel memakai `highlight-reel` hasil olahan + poster; video mentah tidak dideploy.
- Tiga artikel awal ditulis dari materi yang ada: PMPL ID 2026 Fall (Alter Ego Ares juara), M7 (runner-up), AFK Masters Cup (juara), memakai gambar di `data/`.
- Partner tanpa file logo ditampilkan sebagai wordmark teks Anton sampai logo resmi tersedia.
- Pemain tanpa foto memakai siluet topeng.
- Sosmed: Instagram @alteregoesports, @altermerch.id; TikTok @alterego.esports; YouTube @AlterEgoEsports; X @AlterEgo_IDN.

### Interaksi spesifik
- Tab roster: pola ARIA tabs, panah kiri/kanan berpindah tab, game aktif tersimpan di hash URL.
- Filter Store: query string `?kategori=jersey`, bisa dibagikan, berfungsi tanpa JavaScript (link biasa) dan ditingkatkan dengan JavaScript.
- Link marketplace selalu tab baru dengan `rel="noopener noreferrer"`.

---

## Testing Decisions

### Seam yang diusulkan (mohon dikonfirmasi)
1. **Seam utama — Katalog.** Tes memberi file data contoh (fixture) dan memeriksa keluaran domain: urutan roster, ringkasan dihitung ulang, highlight maks 6, parsing harga tunggal dan rentang, kategori, deduplikasi gambar, fallback URL, dan kegagalan build pada data rusak. Satu seam ini menutup hampir semua logika situs.
2. **Seam kedua — Situs hasil build (end-to-end, Playwright).** Beberapa skenario perilaku pada halaman nyata: "Beli Sekarang" mengarah ke Shopee; tab roster berpindah dengan keyboard; filter Store mengubah grid dan URL; di viewport 375px tidak ada permintaan jaringan ke `.glb`/Three.js; reduced-motion tidak menampilkan kanvas; 404 tampil untuk slug tak dikenal.

Fungsi pemetaan Store Mode → deskriptor aksi diuji lewat seam katalog/E2E (mode `marketplace` di E2E, mode `native` cukup di tes unit deskriptor), tanpa seam baru.

### Prinsip tes yang baik
- Uji perilaku yang terlihat dari luar (keluaran katalog, apa yang dilihat/diklik pengunjung), bukan struktur internal komponen atau detail render.
- Tidak ada snapshot test markup penuh; pakai pemeriksaan role/teks/atribut yang bermakna.
- Fixture kecil dan eksplisit; satu fixture per kasus tepi (summary `null`, harga rentang, produk tanpa gambar, field wajib hilang).
- Visual dan motion (partikel, fps) diverifikasi manual lewat checklist DoD, bukan tes otomatis.

### Prior art
Repo belum punya tes (baru `index.html` viewer logo dan skrip Blender). Pola tes dimulai dari spec ini: Vitest untuk katalog, Playwright untuk E2E.

---

## Out of Scope
- Checkout native, keranjang, stepper qty, payment gateway, ongkir, status pesanan (Fase 6, spec terpisah).
- Akun pengguna, wishlist, review produk.
- CMS dan dashboard admin.
- Halaman profil per pemain dan halaman achievement penuh dengan filter.
- 3D di mobile/tablet.
- Versi bahasa Inggris.
- Scraping otomatis link Shopee per produk dan sinkronisasi stok.
- Live score / jadwal pertandingan.

## Further Notes
- **Belum ada issue tracker** dan folder belum repo git; spec ini disimpan lokal. Jalankan `/setup-matt-pocock-skills` bila ingin spec dipublikasikan ke tracker dengan label `ready-for-agent`.
- Data yang perlu diverifikasi manusia sebelum rilis: entri achievement `highlight: true` (17 entri) ke `sources`; izin logo 6 partner.
- `alterego_logo_1.glb` (127 MB) dan video mentah tetap disimpan di luar repo/deploy; hanya versi teroptimasi yang dipakai.
- Gambar produk adalah milik Alter Merch sendiri di Shopee; diunduh & di-host ulang untuk menghindari hotlink rusak.
- Bila diperlukan, keputusan "Astro + statis dulu, endpoint server saat Fase 6" layak dicatat sebagai ADR karena memengaruhi cara checkout dibangun nanti.
