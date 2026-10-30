# Task Breakdown — KreatorPara (Kelompok 1)

Rincian pekerjaan per sprint, diturunkan dari `STORY.md`. Repository: <https://github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara>.
Centang `[x]` jika selesai.

**Asumsi tim (4–5 orang):** PM/Scrum Master, UI/UX, Frontend (Vue/Blade), Backend (Laravel), QA/DevOps. Satu orang boleh memegang lebih dari satu peran.
**Durasi:** 8 minggu (Sprint 0 = 1 minggu, Sprint 1–3 = 2 minggu, Sprint 4 = 1 minggu).
**Kode peran:** `PM` · `UX` · `FE` · `BE` · `QA` · `OPS`

---

## Sprint 0 — Setup & Eksplorasi (Minggu 1)

| ID | Tugas | Peran | Story | Est. |
|---|---|---|---|---|
| T-001 | [ ] Isi repo [`oktober2-kelompok-1-portofolio-kreator-comipara`](https://github.com/vinix7-development/oktober2-kelompok-1-portofolio-kreator-comipara) dengan kode Pixelfed (tambahkan upstream `pixelfed/pixelfed`, kunci di satu tag rilis), atur branch `main` / `develop`, aturan PR & code review | OPS | – | 2 j |
| T-002 | [ ] Jalankan Pixelfed lokal dengan Docker Compose, catat langkahnya di `README` | OPS | – | 4 j |
| T-003 | [ ] Kunci versi Pixelfed (tag/commit) dan matikan federasi di `.env` | BE | – | 1 j |
| T-004 | [ ] Pelajari struktur kode Pixelfed: routes, controllers, models `Profile` & `Status`, komponen Vue | BE, FE | – | 6 j |
| T-005 | [ ] Aktifkan & cek lokalisasi Bahasa Indonesia | FE | – | 2 j |
| T-006 | [ ] Buat board Kanban (GitHub Projects/Trello) dan masukkan semua story | PM | – | 2 j |
| T-007 | [ ] Riset referensi UI (Instagram, Kaskus, Pixiv, katalog event) | UX | – | 3 j |
| T-008 | [ ] Wireframe: direktori, profil kreator, halaman event, forum, form kredit cosplay | UX | – | 8 j |
| T-009 | [ ] UI kit: warna, tipografi, komponen kartu kreator, badge, tombol | UX | – | 6 j |
| T-010 | [ ] Rancang ERD untuk tabel tambahan (lihat PRD §9) | BE | – | 3 j |

**Definition of Done Sprint 0:** semua anggota bisa menjalankan aplikasi di laptop masing-masing; wireframe disetujui dosen/mentor.

---

## Sprint 1 — Akun & Profil Kreator (Minggu 2–3)

| ID | Tugas | Peran | Story | Est. |
|---|---|---|---|---|
| T-101 | [ ] Migration & model `creator_profiles`, `creator_links` | BE | US-01, US-02 | 3 j |
| T-102 | [ ] Endpoint simpan/ubah profil kreator + validasi (kategori 1–3, URL, nomor WA) | BE | US-01, US-02 | 5 j |
| T-103 | [ ] Halaman `/settings/kreator` (form kategori, kota, status komisi, layanan, tautan) | FE | US-01, US-02 | 6 j |
| T-104 | [ ] Label kategori & status komisi di header profil | FE | US-02 | 3 j |
| T-105 | [ ] Tab Karya / Cosplay / Event di profil | FE | US-03 | 5 j |
| T-106 | [ ] Uji unggah: batas 10 foto, maks 15 MB, EXIF lokasi terhapus, opsi konten sensitif | QA | US-04 | 3 j |
| T-107 | [ ] Uji like, komentar, balas, follow, notifikasi (fitur bawaan) | QA | US-05, US-06 | 3 j |
| T-108 | [ ] Feature test Laravel untuk endpoint profil kreator | BE | US-01, US-02 | 3 j |
| T-109 | [ ] Desain hi-fi halaman profil kreator (mobile & desktop) | UX | US-02, US-03 | 5 j |
| T-110 | [ ] Sprint review & retrospektif | PM | – | 2 j |

---

## Sprint 2 — Event, Kehadiran & Direktori (Minggu 4–5)

| ID | Tugas | Peran | Story | Est. |
|---|---|---|---|---|
| T-201 | [ ] Migration & model `events`, `event_attendances` | BE | US-08, US-09 | 3 j |
| T-202 | [ ] CRUD event di panel admin + validasi tanggal + upload banner | BE, FE | US-08 | 6 j |
| T-203 | [ ] Form pengajuan kehadiran (pilih event publik, booth, hari hadir), cegah duplikat | BE, FE | US-09 | 5 j |
| T-204 | [ ] Halaman admin persetujuan kehadiran (filter event/status, alasan penolakan, notifikasi) | BE, FE | US-10 | 6 j |
| T-205 | [ ] Komponen badge "Hadir di Comipara" + nomor booth; logika event selesai → riwayat | FE | US-11 | 3 j |
| T-206 | [ ] Endpoint API direktori: pencarian teks, filter kombinasi, sorting, paginasi | BE | US-12 | 8 j |
| T-207 | [ ] Index database untuk kolom filter (kategori, status komisi, event, status) | BE | US-12 | 2 j |
| T-208 | [ ] Halaman `/direktori`: kartu kreator, panel filter, sinkron query string, state kosong | FE | US-12 | 10 j |
| T-209 | [ ] Seeder 200 kreator dummy + uji performa direktori (< 2 detik) | BE, QA | US-12 | 4 j |
| T-210 | [ ] Halaman `/event/{slug}`: info event, daftar kreator, galeri foto bertag event | FE, BE | US-13 | 6 j |
| T-211 | [ ] Desain hi-fi direktori & halaman event | UX | US-12, US-13 | 6 j |
| T-212 | [ ] Uji fungsional alur kreator onboarding → badge tampil (PRD §10 alur 1–2) | QA | US-08–US-12 | 4 j |
| T-213 | [ ] Sprint review & retrospektif | PM | – | 2 j |

---

## Sprint 3 — Kredit Cosplay, Forum & Moderasi (Minggu 6–7)

| ID | Tugas | Peran | Story | Est. |
|---|---|---|---|---|
| T-301 | [ ] Migration & model `cosplay_credits` | BE | US-07 | 2 j |
| T-302 | [ ] Bagian "Kredit Cosplay" di form posting (autocomplete akun, karakter, seri, event) | FE | US-07 | 6 j |
| T-303 | [ ] Notifikasi tag + aksi setujui/hapus tag | BE, FE | US-07 | 5 j |
| T-304 | [ ] Tampilan kredit di bawah foto | FE | US-07 | 2 j |
| T-305 | [ ] Migration & model `boards`, `threads`, `thread_replies`, `thread_votes` | BE | US-14–US-17 | 3 j |
| T-306 | [ ] CRUD board di admin | BE, FE | US-14 | 3 j |
| T-307 | [ ] Halaman daftar board, daftar thread, detail thread, form thread & balasan | FE | US-15 | 10 j |
| T-308 | [ ] API thread & balasan (1 tingkat bersarang) + notifikasi balasan | BE | US-15 | 6 j |
| T-309 | [ ] Upvote (toggle, unik per user) + sorting terbaru/terpopuler 7 hari | BE, FE | US-16 | 5 j |
| T-310 | [ ] Aksi moderator: pin, lock, hapus thread | BE, FE | US-17 | 4 j |
| T-311 | [ ] Pengajuan & persetujuan verifikasi + ikon centang | BE, FE | US-18 | 5 j |
| T-312 | [ ] Kategori laporan "Pencurian karya" + field tautan karya asli | BE, FE | US-19 | 3 j |
| T-313 | [ ] Antrian laporan: aksi abaikan/sembunyikan/peringatkan/nonaktifkan + log aksi | BE, FE | US-20 | 6 j |
| T-314 | [ ] Desain hi-fi forum & form kredit cosplay | UX | US-07, US-15 | 5 j |
| T-315 | [ ] Uji fungsional forum & moderasi (PRD §10 alur 3–4) | QA | US-14–US-20 | 5 j |
| T-316 | [ ] Sprint review & retrospektif | PM | – | 2 j |

---

## Sprint 4 — Stabilisasi, Deploy & Demo (Minggu 8)

| ID | Tugas | Peran | Story | Est. |
|---|---|---|---|---|
| T-401 | [ ] Perbaikan bug hasil pengujian Sprint 1–3 | BE, FE | – | 10 j |
| T-402 | [ ] Seed data demo: ≥ 20 kreator, ≥ 100 postingan, 1 event, 4 board, beberapa thread | BE | – | 4 j |
| T-403 | [ ] Deploy ke VPS/hosting (Docker Compose, HTTPS, queue worker, backup DB) | OPS | – | 6 j |
| T-404 | [ ] Tautan "Source code" di footer (kewajiban AGPL) + repo publik | OPS | – | 1 j |
| T-405 | [ ] UAT dengan 5 penguji + kuesioner singkat | QA, PM | – | 4 j |
| T-406 | [ ] Audit Lighthouse mobile halaman direktori (target ≥ 70) | QA, FE | – | 2 j |
| T-407 | [ ] Dokumentasi: README instalasi, panduan admin, daftar fitur custom | PM | – | 4 j |
| T-408 | [ ] Slide & skenario demo | PM, UX | – | 4 j |

---

## Backlog (Could — dikerjakan jika waktu tersisa)

| ID | Tugas | Peran | Story | Est. |
|---|---|---|---|---|
| T-501 | [ ] Watermark otomatis saat unggah (job queue + Intervention Image) | BE | US-21 | 6 j |
| T-502 | [ ] Daftar "Rencana Kunjungan Booth" | BE, FE | US-22 | 5 j |
| T-503 | [ ] Generator QR code profil (unduh PNG) | BE, FE | US-23 | 3 j |

---

## Definition of Done (berlaku untuk setiap tugas)

- Kode di-review minimal 1 anggota lain sebelum merge ke `develop`.
- Tidak ada error di console browser maupun log Laravel.
- Tampilan sudah dicek di lebar layar 360px dan 1280px.
- Kriteria penerimaan story terkait sudah dicentang di `STORY.md`.
