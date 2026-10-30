# PRD — Platform Direktori & Portofolio Interaktif Kreator Lokal (Comipara)

| Item | Keterangan |
|---|---|
| Kelompok | 1 |
| Nama kerja produk | **KreatorPara** (boleh diganti) |
| Jenis aplikasi | Web app (responsive, mobile-first) |
| Basis teknologi | Fork dari [Pixelfed](https://github.com/pixelfed/pixelfed) |
| Repository | [github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara](https://github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara) |
| Versi dokumen | 1.0 — 30 Oktober 2026 |
| Dokumen terkait | `STORY.md` (user story), `TASK.md` (rincian pekerjaan) |

---

## 1. Ringkasan

KreatorPara adalah platform web tempat kreator lokal (illustrator, cosplayer, fotografer cosplay, crafter) yang tampil di event **Comipara** bisa memajang portofolio, membagikan foto karya, dan berinteraksi dengan pengunjung lewat komentar dan like. Selain fungsi media sosial (mirip Instagram), platform ini punya **direktori kreator** yang bisa dicari dan difilter: siapa saja yang ikut Comipara, di booth mana, kategorinya apa, dan apakah sedang buka komisi. Ada juga ruang diskusi berbentuk thread (mirip Kaskus) untuk obrolan komunitas.

## 2. Latar Belakang & Masalah

- Kreator lokal menyebar portofolionya di banyak tempat (Instagram, X, Facebook, Pixiv). Pengunjung event susah menemukan **siapa saja kreator yang hadir** dan **di booth mana**.
- Katalog event biasanya berupa PDF/gambar statis yang tidak bisa dicari, tidak bisa dikomentari, dan cepat basi setelah event selesai.
- Cosplayer dan fotografer sering kesulitan **saling memberi kredit** (siapa cosplayer, siapa fotografer, karakter apa) secara rapi.
- Belum ada wadah yang mempertahankan hubungan kreator–penggemar **setelah** event selesai.

## 3. Tujuan & Bukan Tujuan

### Tujuan
1. Pengunjung bisa menemukan kreator berdasarkan kategori, nama, fandom/tag, dan nomor booth dalam < 3 klik.
2. Kreator bisa membuat profil portofolio lengkap dan mengunggah karya dalam < 5 menit.
3. Ada interaksi dua arah: like, komentar, follow, dan thread diskusi.
4. Konten aman: ada fitur laporan, penanda konten sensitif, dan moderasi admin.

### Bukan Tujuan (di luar cakupan versi ini)
- Transaksi jual-beli / pembayaran komisi di dalam platform (cukup tautan ke kontak kreator).
- Aplikasi mobile native (Android/iOS).
- Federasi ActivityPub ke server Pixelfed/Mastodon lain (dimatikan di MVP, lihat §8).
- Penjualan tiket event.

## 4. Persona

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Nadia — Illustrator** | 22 th, jualan merchandise & art print di booth, buka komisi online | Portofolio rapi, info booth, status komisi, tautan kontak |
| **Raka — Cosplayer** | 20 th, ikut kompetisi & sesi foto | Album cosplay per karakter, kredit fotografer, interaksi fans |
| **Dimas — Fotografer cosplay** | 25 th, memotret banyak cosplayer per event | Tag cosplayer di foto, album per event |
| **Sari — Pengunjung** | 17–30 th, datang ke Comipara | Cari kreator favorit, lihat booth, simpan & komentari karya |
| **Admin/Moderator** | Panitia atau pengelola komunitas | Verifikasi kreator, kelola event & booth, tindak laporan |

## 5. Ruang Lingkup MVP

Prioritas pakai **MoSCoW** (M = Must, S = Should, C = Could, W = Won't untuk versi ini).

### 5.1 Fitur bawaan Pixelfed yang dipakai ulang
- Registrasi/login, profil, follow/unfollow
- Posting foto (single & album/carousel), caption, hashtag
- Like, komentar (termasuk balasan komentar), bookmark
- Feed beranda & halaman Explore/Discover
- Penanda konten sensitif (content warning)
- Laporan konten & panel admin dasar

### 5.2 Fitur yang dikembangkan sendiri (custom)

| ID | Fitur | Prioritas |
|---|---|---|
| FR-01 | **Tipe akun Kreator** dengan kategori (Illustrator, Cosplayer, Fotografer, Crafter, Lainnya) | M |
| FR-02 | **Profil portofolio kreator**: bio, kategori, tautan sosmed, status komisi (buka/tutup), daftar harga ringkas (opsional), kota | M |
| FR-03 | **Direktori kreator** dengan pencarian nama & filter kategori, status komisi, event, hari hadir | M |
| FR-04 | **Manajemen event** (admin): buat event Comipara per edisi (nama, tanggal, lokasi) | M |
| FR-05 | **Kehadiran di event**: kreator mendaftarkan diri ke event + nomor booth + hari hadir; admin menyetujui | M |
| FR-06 | **Badge "Hadir di Comipara"** di profil dan kartu direktori, plus nomor booth | M |
| FR-07 | **Kredit pada postingan cosplay**: nama karakter, judul seri/fandom, tag akun cosplayer & fotografer | S |
| FR-08 | **Halaman event**: daftar kreator yang hadir, galeri foto bertag event | S |
| FR-09 | **Thread diskusi (gaya Kaskus)**: board per topik (Info Event, Cari Partner Cosplay, Review Booth, Tips Karya), thread + balasan + upvote | S |
| FR-10 | **Verifikasi kreator** (centang) oleh admin | S |
| FR-11 | **Laporan pelanggaran hak cipta / art theft** dengan kategori khusus | S |
| FR-12 | **Watermark otomatis** opsional saat unggah karya | C |
| FR-13 | **Favoritkan kreator → daftar "Rencana Kunjungan Booth"** yang bisa dilihat saat di event | C |
| FR-14 | **QR code profil kreator** untuk dicetak dan dipajang di booth | C |
| FR-15 | Federasi ActivityPub | W |
| FR-16 | Pembayaran komisi di platform | W |

## 6. Kebutuhan Fungsional Rinci

### FR-01 & FR-02 — Akun dan Profil Kreator
- Saat registrasi atau dari pengaturan, user bisa beralih menjadi **Kreator** dan memilih 1–3 kategori.
- Field profil tambahan: `display_name`, `kategori[]`, `kota`, `status_komisi` (buka/tutup/waitlist), `link_kontak[]` (Instagram, X, email, WhatsApp bisnis), `deskripsi_layanan` (maks 500 karakter).
- Profil menampilkan grid karya, tab **Karya**, **Cosplay** (jika kategori cosplayer), **Event** (riwayat kehadiran).

### FR-03 — Direktori Kreator
- Halaman `/direktori` menampilkan kartu kreator: avatar, nama, kategori, 3 thumbnail karya terbaru, badge event, nomor booth.
- Pencarian teks (nama, username, kota) dan filter: kategori, status komisi, event, hari hadir.
- Urutan: default "Terbaru bergabung"; opsi "Paling banyak pengikut", "Nomor booth".
- Paginasi atau infinite scroll, 24 kartu per halaman.

### FR-04, FR-05, FR-06 — Event & Kehadiran
- Admin membuat event: nama (contoh "Comipara 2027"), tanggal mulai–selesai, lokasi, banner, status (draft/publik/selesai).
- Kreator mengajukan kehadiran: pilih event, isi nomor booth (teks bebas, misal "B-12"), centang hari hadir.
- Admin menyetujui/menolak pengajuan. Setelah disetujui, badge dan nomor booth tampil.

### FR-07 — Kredit Cosplay
- Saat posting, kreator bisa mengisi: karakter, seri/fandom, tag akun cosplayer, tag akun fotografer, event terkait.
- Akun yang di-tag mendapat notifikasi dan bisa **menyetujui** atau **menghapus** tag dirinya.

### FR-09 — Thread Diskusi
- Board ditentukan admin. User membuat thread (judul, isi, gambar opsional), user lain membalas.
- Upvote thread & balasan; urutan "Terbaru" dan "Terpopuler".
- Admin/moderator bisa sematkan (pin), kunci (lock), dan hapus thread.

### FR-10, FR-11 — Verifikasi & Moderasi
- Kreator mengajukan verifikasi dengan bukti (link sosmed aktif / bukti booth).
- Laporan memiliki kategori: spam, konten tidak pantas, pelecehan, **pencurian karya/hak cipta**, lainnya.
- Antrian laporan di panel admin dengan aksi: abaikan, sembunyikan konten, peringatkan user, nonaktifkan akun.

## 7. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | Halaman direktori dan feed tampil < 2 detik di koneksi 4G; gambar di-resize & dikompres (bawaan Pixelfed) |
| Responsif | Dioptimalkan untuk layar 360px ke atas (pengunjung membuka di HP saat event) |
| Keamanan | HTTPS, password di-hash (bawaan Laravel), rate limit login & posting, validasi tipe/ukuran file (maks 15 MB per gambar) |
| Privasi | Metadata EXIF lokasi dihapus otomatis saat unggah; akun bisa private |
| Aksesibilitas | Alt text pada gambar (field tersedia di Pixelfed), kontras warna minimal WCAG AA |
| Bahasa | Antarmuka Bahasa Indonesia (gunakan file lokalisasi Pixelfed) |
| Lisensi | Pixelfed berlisensi **AGPL-3.0**: kode hasil modifikasi yang dijalankan publik wajib dibuka sumbernya (repo GitHub kelompok publik) |

## 8. Arsitektur & Stack

```
[Browser] ── HTTPS ──> [Nginx] ──> [Pixelfed (Laravel, PHP)] ──> [MySQL/MariaDB]
                                         │
                                         ├──> [Redis] (cache & queue)
                                         ├──> [Queue worker / Horizon] (proses gambar)
                                         └──> [Storage lokal / S3-compatible] (file gambar)
```

- **Backend:** Laravel (bawaan Pixelfed). Fitur custom dibuat sebagai Controller, Model, Migration baru di fork.
- **Frontend:** Blade + Vue (bawaan Pixelfed). Halaman direktori, event, dan thread dibuat sebagai komponen Vue baru.
- **Database:** MySQL 9+ atau MariaDB 11+ (yang direkomendasikan resmi; PostgreSQL hanya "best effort").
- **Deployment:** Docker Compose (cara yang direkomendasikan Pixelfed).
- **Federasi:** dimatikan di `.env` untuk MVP supaya moderasi lebih sederhana.

## 9. Model Data (tambahan di luar tabel bawaan Pixelfed)

| Tabel | Kolom penting |
|---|---|
| `creator_profiles` | id, profile_id (FK ke profil Pixelfed), categories (json), city, commission_status, service_description, verified_at |
| `creator_links` | id, creator_profile_id, platform, url |
| `events` | id, name, slug, start_date, end_date, location, banner_path, status |
| `event_attendances` | id, event_id, creator_profile_id, booth_code, days (json), status (pending/approved/rejected), approved_by |
| `cosplay_credits` | id, status_id (FK postingan), character_name, series_name, cosplayer_profile_id, photographer_profile_id, event_id, tag_status |
| `boards` | id, name, slug, description, sort_order |
| `threads` | id, board_id, profile_id, title, body, is_pinned, is_locked, upvotes_count, replies_count |
| `thread_replies` | id, thread_id, profile_id, body, parent_id, upvotes_count |
| `thread_votes` | id, votable_type, votable_id, profile_id |

## 10. Alur Utama

1. **Kreator onboarding:** Daftar → pilih "Saya Kreator" → isi kategori & profil → unggah 3 karya pertama → ajukan kehadiran di Comipara → menunggu persetujuan admin → badge tampil.
2. **Pengunjung mencari kreator:** Buka `/direktori` → filter "Cosplayer" + "Comipara 2027" → klik kartu → lihat profil & nomor booth → follow → komentar di foto.
3. **Diskusi:** Buka board "Cari Partner Cosplay" → buat thread → user lain membalas & upvote.
4. **Moderasi:** User melaporkan foto (kategori "pencurian karya") → admin melihat antrian → sembunyikan postingan & kirim peringatan.

## 11. Struktur Halaman (Sitemap)

- `/` Beranda (feed)
- `/explore` Explore (bawaan)
- `/direktori` Direktori kreator
- `/event/{slug}` Halaman event
- `/forum` Daftar board → `/forum/{board}` → `/forum/{board}/{thread}`
- `/{username}` Profil / portofolio
- `/settings/kreator` Pengaturan profil kreator & pengajuan event
- `/admin/...` Panel admin (event, kehadiran, verifikasi, board, laporan)

## 12. Metrik Keberhasilan (untuk demo/UAT)

- ≥ 20 akun kreator dummy + ≥ 100 postingan contoh saat demo.
- Pengujian UAT: 5 penguji berhasil menemukan kreator tertentu lewat direktori dalam < 1 menit.
- 0 bug kritis (blocker) di skenario utama §10.
- Skor Lighthouse mobile ≥ 70 untuk halaman direktori.

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kode Pixelfed besar dan kompleks, kurva belajar tinggi | Jadwal molor | Sprint 0 khusus eksplorasi kode; fitur custom dibuat sebagai modul terpisah sebisa mungkin |
| Konflik saat update upstream Pixelfed | Sulit merge | Kunci versi Pixelfed di awal proyek; jangan update di tengah sprint |
| Konten NSFW / pencurian karya | Reputasi platform | Content warning wajib, laporan khusus hak cipta, moderasi admin |
| Penyimpanan gambar membengkak | Biaya server | Batas ukuran file, kompresi, kuota per akun |
| Kewajiban AGPL | Masalah lisensi | Repo publik + tautan "Source code" di footer |
| Kontribusi kode kembali ke repo resmi Pixelfed | Ditolak | Repo resmi melarang kontribusi buatan AI; fork kelompok aman, tapi jangan kirim PR AI ke upstream |

## 14. Milestone (asumsi 8 minggu, 4 sprint × 2 minggu)

| Sprint | Fokus | Output |
|---|---|---|
| 0 (minggu 1) | Setup & eksplorasi Pixelfed, desain UI | Pixelfed jalan lokal via Docker, wireframe & UI kit |
| 1 (minggu 2–3) | Akun kreator, profil portofolio | FR-01, FR-02 |
| 2 (minggu 4–5) | Event, kehadiran, direktori | FR-03 s.d. FR-06 |
| 3 (minggu 6–7) | Kredit cosplay, forum, verifikasi, moderasi | FR-07 s.d. FR-11 |
| 4 (minggu 8) | Testing, seed data, deploy, demo | Aplikasi live + laporan UAT |

Rincian tugas ada di `TASK.md`.

## 15. Pertanyaan Terbuka

- Apakah platform hanya untuk Comipara, atau disiapkan untuk event lain juga? (Desain data sudah mendukung banyak event.)
- Apakah perlu batas usia minimal pengguna? (Disarankan 13+ dengan filter konten sensitif aktif secara default.)
- Siapa yang menjadi admin/moderator saat demo: dosen, mentor, atau anggota kelompok?
