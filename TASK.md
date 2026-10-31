# Task — KreatorPara (Kelompok 1)

Satu tugas = satu issue GitHub. Total **6 tugas**.
Repository: <https://github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara>

**Kode peran:** `PM` (project manager) · `UX` (desain) · `FE` (frontend) · `BE` (backend) · `QA` (pengujian) · `OPS` (server & deploy)

| ID | Tugas | Sprint | Tanggal | Peran | Fitur / Story |
|---|---|---|---|---|---|
| T-01 | Setup Pixelfed & desain UI | 0 | 3 – 9 Nov 2026 | OPS, UX, PM | – |
| T-02 | Berbagi foto, like & komentar | 1 | 10 – 23 Nov 2026 | FE, QA | F-01 · US-01, US-02 |
| T-03 | Akun & profil portofolio kreator | 1 | 10 – 23 Nov 2026 | BE, FE, UX | F-02 · US-03 |
| T-04 | Event Comipara, kehadiran & nomor booth | 2 | 24 Nov – 7 Des 2026 | BE, FE | F-03 · US-04, US-05 |
| T-05 | Direktori kreator (cari & filter) | 3 | 8 – 21 Des 2026 | BE, FE | F-04 · US-06 |
| T-06 | Pengujian, deploy & demo | 4 | 22 – 28 Des 2026 | QA, OPS, PM | – |

---

## T-01 — Setup Pixelfed & desain UI
**Sprint 0 · 3 – 9 Nov 2026 · OPS, UX, PM**
- [ ] Masukkan kode Pixelfed ke repo kelompok dan buat branch `develop`
- [ ] Jalankan Pixelfed di laptop dengan Docker Compose, lalu tulis langkahnya di `README`
- [ ] Matikan federasi dan aktifkan Bahasa Indonesia
- [ ] Buat wireframe halaman profil kreator, halaman event, dan direktori

## T-02 — Berbagi foto, like & komentar
**Sprint 1 · 10 – 23 Nov 2026 · FE, QA · F-01 (US-01, US-02)**
- [ ] Uji unggah foto tunggal & album, termasuk batas 15 MB
- [ ] Uji like, komentar, follow, dan notifikasi
- [ ] Rapikan teks yang belum berbahasa Indonesia

## T-03 — Akun & profil portofolio kreator
**Sprint 1 · 10 – 23 Nov 2026 · BE, FE, UX · F-02 (US-03)**
- [ ] Buat tabel `creator_profiles` (migration & model)
- [ ] Buat halaman pengaturan "Saya Kreator": kategori, kota, status komisi, deskripsi, tautan
- [ ] Tampilkan label kategori & status komisi di profil
- [ ] Validasi form (kategori 1–3, URL tautan valid)

## T-04 — Event Comipara, kehadiran & nomor booth
**Sprint 2 · 24 Nov – 7 Des 2026 · BE, FE · F-03 (US-04, US-05)**
- [ ] Buat tabel `events` dan `event_attendances`
- [ ] Halaman admin: buat event, setujui/tolak kehadiran
- [ ] Form kreator: daftar ke event + nomor booth
- [ ] Badge "Hadir di Comipara · Booth …" di profil

## T-05 — Direktori kreator (cari & filter)
**Sprint 3 · 8 – 21 Des 2026 · BE, FE · F-04 (US-06)**
- [ ] Buat endpoint daftar kreator dengan pencarian & filter
- [ ] Buat halaman `/direktori` dengan kartu kreator
- [ ] Tambahkan filter kategori, status komisi, event
- [ ] Tampilkan pesan saat hasil kosong

## T-06 — Pengujian, deploy & demo
**Sprint 4 · 22 – 28 Des 2026 · QA, OPS, PM**
- [ ] Isi data demo (10 kreator, 30 foto, 1 event)
- [ ] Uji alur utama dari awal sampai akhir dan perbaiki bug
- [ ] Deploy ke server/hosting dan pasang HTTPS
- [ ] Siapkan slide & skenario demo
