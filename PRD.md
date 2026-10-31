# PRD — Platform Direktori & Portofolio Interaktif Kreator Lokal (Comipara)

| Item | Keterangan |
|---|---|
| Kelompok | 1 |
| Nama kerja produk | **KreatorPara** (boleh diganti) |
| Jenis aplikasi | Web app (responsive, mobile-first) |
| Basis teknologi | Fork dari [Pixelfed](https://github.com/pixelfed/pixelfed) |
| Repository | [github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara](https://github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara) |
| Versi dokumen | 2.0 — 31 Oktober 2026 (disederhanakan ke fitur utama) |
| Dokumen terkait | `STORY.md` (user story), `TASK.md` (tugas = issue GitHub) |

---

## 1. Ringkasan

KreatorPara adalah web tempat kreator lokal (illustrator, cosplayer, fotografer) yang ikut event **Comipara** memajang portofolio dan berbagi foto karya. Pengunjung bisa menyukai dan mengomentari foto, mirip Instagram. Platform ini juga punya **direktori kreator** untuk mencari siapa saja yang hadir di Comipara dan di booth mana.

## 2. Masalah

- Portofolio kreator tersebar di banyak media sosial, jadi pengunjung susah tahu kreator mana yang hadir di Comipara dan di booth mana.
- Katalog event biasanya berupa PDF statis yang tidak bisa dicari dan tidak bisa dikomentari.

## 3. Tujuan

1. Kreator bisa membuat profil portofolio dan mengunggah karya.
2. Pengunjung bisa berinteraksi lewat like, komentar, dan follow.
3. Pengunjung bisa menemukan kreator berdasarkan kategori dan melihat nomor booth-nya di Comipara.

## 4. Pengguna

| Pengguna | Kebutuhan utama |
|---|---|
| **Kreator** (illustrator, cosplayer, fotografer) | Profil portofolio, unggah karya, info booth |
| **Pengunjung** | Cari kreator, lihat karya, like & komentar |
| **Admin** | Kelola event dan setujui kehadiran kreator |

## 5. Fitur Utama

| ID | Fitur | Sumber | Sprint |
|---|---|---|---|
| F-01 | **Berbagi foto, like & komentar** | Bawaan Pixelfed, diterjemahkan & diuji | 1 |
| F-02 | **Akun & profil portofolio kreator** | Pengembangan baru | 1 |
| F-03 | **Event Comipara, kehadiran & nomor booth** | Pengembangan baru | 2 |
| F-04 | **Direktori kreator (cari & filter)** | Pengembangan baru | 3 |

### F-01 — Berbagi Foto, Like & Komentar
Memakai fitur bawaan Pixelfed: unggah foto (single/album), caption, hashtag, like, komentar, follow, dan feed. Kelompok cukup memastikan fitur ini berjalan, antarmukanya berbahasa Indonesia, dan batas unggahannya sesuai (maks 15 MB per foto).

### F-02 — Akun & Profil Portofolio Kreator
- User bisa menandai akunnya sebagai **Kreator** dan memilih 1–3 kategori (Illustrator, Cosplayer, Fotografer, Crafter, Lainnya).
- Profil kreator menampilkan kota, status komisi (buka/tutup), deskripsi singkat, dan tautan sosial media.

### F-03 — Event Comipara, Kehadiran & Nomor Booth
- Admin membuat event (nama, tanggal, lokasi).
- Kreator mendaftarkan kehadiran beserta nomor booth, lalu admin menyetujuinya.
- Profil kreator yang disetujui menampilkan badge **"Hadir di Comipara · Booth B-12"**.

### F-04 — Direktori Kreator
- Halaman `/direktori` berisi kartu kreator: avatar, nama, kategori, 3 karya terbaru, dan nomor booth.
- Pencarian nama, serta filter berdasarkan kategori, status komisi, dan event.

## 6. Di Luar Cakupan (pengembangan lanjutan)

Fitur berikut **tidak** dikerjakan di proyek ini, tapi boleh dijadikan bahan pengayaan jika waktu tersisa: forum thread gaya Kaskus, kredit cosplay (tag fotografer/cosplayer), verifikasi centang kreator, laporan pencurian karya, watermark otomatis, QR code profil, federasi ActivityPub, dan pembayaran komisi.

## 7. Kebutuhan Non-Fungsional

- Tampilan nyaman di HP (lebar 360px ke atas).
- Password di-hash dan file unggahan divalidasi (bawaan Laravel/Pixelfed).
- Lisensi Pixelfed **AGPL-3.0**: repo kelompok harus publik.

## 8. Teknologi

- **Backend:** Laravel/PHP (bawaan Pixelfed)
- **Frontend:** Blade + Vue (bawaan Pixelfed)
- **Database:** MySQL atau MariaDB
- **Menjalankan aplikasi:** Docker Compose
- Federasi dimatikan supaya lebih sederhana.

**Tabel tambahan:** `creator_profiles` (kategori, kota, status komisi, tautan), `events` (nama, tanggal, lokasi), dan `event_attendances` (event, kreator, nomor booth, status).

## 9. Alur Utama

1. Kreator mendaftar, memilih "Saya Kreator", mengisi profil, lalu mengunggah karya.
2. Kreator mendaftarkan kehadiran di Comipara dengan nomor booth, dan admin menyetujuinya.
3. Pengunjung membuka direktori, memfilter "Cosplayer", membuka profil, lalu follow dan berkomentar di foto.

## 10. Jadwal

| Sprint | Tanggal | Fokus |
|---|---|---|
| 0 | 3 – 9 Nov 2026 | Setup Pixelfed & desain UI |
| 1 | 10 – 23 Nov 2026 | F-01, F-02 |
| 2 | 24 Nov – 7 Des 2026 | F-03 |
| 3 | 8 – 21 Des 2026 | F-04 |
| 4 | 22 – 28 Des 2026 | Pengujian, deploy & demo (25 Des libur) |

## 11. Kriteria Selesai Proyek

- Keempat fitur utama berjalan sesuai `STORY.md`.
- Ada data demo minimal 10 kreator dan 30 foto.
- Aplikasi bisa diakses online dan didemokan dari awal sampai akhir sesuai alur di §9.
