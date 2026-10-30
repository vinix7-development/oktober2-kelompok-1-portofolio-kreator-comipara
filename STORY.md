# User Story — KreatorPara (Kelompok 1)

Format: **Sebagai** [peran], **saya ingin** [aksi], **agar** [manfaat].
Kriteria penerimaan memakai pola *Given / When / Then* (Diberikan / Ketika / Maka).
Estimasi memakai **story point** (Fibonacci 1, 2, 3, 5, 8). Prioritas mengikuti PRD (M/S/C).

---

## Epic E1 — Akun & Profil Kreator

### US-01 — Menjadi akun kreator `FR-01` · M · 3 SP
**Sebagai** pengguna baru, **saya ingin** menandai akun saya sebagai kreator dan memilih kategori, **agar** saya muncul di direktori kreator.

**Kriteria penerimaan**
- [ ] Diberikan saya sudah login, ketika saya membuka `/settings/kreator` dan memilih "Saya Kreator", maka form kategori muncul.
- [ ] Saya bisa memilih 1–3 kategori; memilih 0 atau lebih dari 3 menampilkan pesan error.
- [ ] Setelah disimpan, profil saya punya label kategori dan masuk ke direktori.

### US-02 — Melengkapi profil portofolio `FR-02` · M · 5 SP
**Sebagai** kreator, **saya ingin** mengisi bio, kota, status komisi, deskripsi layanan, dan tautan kontak, **agar** pengunjung tahu cara menghubungi dan memesan karya saya.

**Kriteria penerimaan**
- [ ] Field: kota, status komisi (buka/tutup/waitlist), deskripsi layanan (maks 500 karakter), hingga 5 tautan kontak.
- [ ] URL tautan divalidasi (harus `https://`), nomor WhatsApp divalidasi format Indonesia.
- [ ] Status komisi tampil sebagai label berwarna di profil dan kartu direktori.

### US-03 — Tab portofolio di profil `FR-02` · S · 3 SP
**Sebagai** pengunjung, **saya ingin** melihat profil kreator dengan tab Karya, Cosplay, dan Event, **agar** saya mudah menelusuri karyanya.

**Kriteria penerimaan**
- [ ] Tab "Cosplay" hanya tampil jika kreator punya kategori Cosplayer.
- [ ] Tab "Event" menampilkan riwayat event yang disetujui beserta nomor booth.

---

## Epic E2 — Berbagi Foto & Interaksi (bawaan Pixelfed, disesuaikan)

### US-04 — Mengunggah karya `bawaan` · M · 2 SP
**Sebagai** kreator, **saya ingin** mengunggah satu atau beberapa foto dengan caption dan hashtag, **agar** karya saya tampil di profil dan feed.

**Kriteria penerimaan**
- [ ] Bisa unggah hingga 10 foto dalam satu postingan (album/carousel).
- [ ] File > 15 MB atau bukan gambar ditolak dengan pesan jelas.
- [ ] Metadata lokasi EXIF terhapus setelah unggah.
- [ ] Opsi "konten sensitif" tersedia saat posting.

### US-05 — Like, komentar, dan balas komentar `bawaan` · M · 2 SP
**Sebagai** pengunjung, **saya ingin** menyukai dan mengomentari foto serta membalas komentar, **agar** saya bisa berinteraksi dengan kreator.

**Kriteria penerimaan**
- [ ] Jumlah like dan komentar ter-update tanpa reload halaman.
- [ ] Pemilik postingan mendapat notifikasi saat ada like/komentar baru.
- [ ] Pemilik postingan bisa menghapus komentar di postingannya.

### US-06 — Follow kreator `bawaan` · M · 1 SP
**Sebagai** pengunjung, **saya ingin** mengikuti kreator, **agar** karya barunya muncul di feed saya.

**Kriteria penerimaan**
- [ ] Tombol Follow/Unfollow berfungsi dan jumlah pengikut ter-update.
- [ ] Postingan kreator yang diikuti muncul di feed beranda.

### US-07 — Kredit cosplay pada postingan `FR-07` · S · 5 SP
**Sebagai** fotografer, **saya ingin** menandai cosplayer, karakter, seri, dan event pada foto, **agar** kredit tercatat rapi dan mudah ditemukan.

**Kriteria penerimaan**
- [ ] Form posting punya bagian opsional "Kredit Cosplay": karakter, seri/fandom, akun cosplayer, akun fotografer, event.
- [ ] Akun yang di-tag menerima notifikasi dan bisa menyetujui atau menghapus tag dirinya.
- [ ] Kredit tampil di bawah foto dan bisa diklik menuju profil terkait.

---

## Epic E3 — Event & Direktori

### US-08 — Admin membuat event `FR-04` · M · 3 SP
**Sebagai** admin, **saya ingin** membuat event Comipara per edisi, **agar** kreator bisa mendaftarkan kehadirannya.

**Kriteria penerimaan**
- [ ] Form: nama, slug otomatis, tanggal mulai–selesai, lokasi, banner, status (draft/publik/selesai).
- [ ] Event berstatus draft tidak tampil untuk publik.
- [ ] Tanggal selesai tidak boleh lebih awal dari tanggal mulai.

### US-09 — Kreator mengajukan kehadiran di event `FR-05` · M · 3 SP
**Sebagai** kreator, **saya ingin** mendaftarkan kehadiran saya di event beserta nomor booth dan hari hadir, **agar** pengunjung tahu di mana menemui saya.

**Kriteria penerimaan**
- [ ] Hanya event berstatus publik yang bisa dipilih.
- [ ] Satu kreator hanya bisa punya satu pengajuan per event.
- [ ] Status awal "Menunggu persetujuan".

### US-10 — Admin menyetujui kehadiran `FR-05` · M · 2 SP
**Sebagai** admin, **saya ingin** menyetujui atau menolak pengajuan kehadiran, **agar** data booth yang tampil valid.

**Kriteria penerimaan**
- [ ] Daftar pengajuan bisa difilter berdasarkan event dan status.
- [ ] Penolakan wajib menyertakan alasan, yang dikirim ke kreator lewat notifikasi.

### US-11 — Badge kehadiran & nomor booth `FR-06` · M · 2 SP
**Sebagai** pengunjung, **saya ingin** melihat badge "Hadir di Comipara" dan nomor booth di profil kreator, **agar** saya bisa langsung mendatangi booth-nya.

**Kriteria penerimaan**
- [ ] Badge hanya tampil jika kehadiran berstatus disetujui dan event belum selesai.
- [ ] Setelah event selesai, badge berubah menjadi riwayat di tab Event.

### US-12 — Mencari & memfilter direktori kreator `FR-03` · M · 8 SP
**Sebagai** pengunjung, **saya ingin** mencari kreator berdasarkan nama dan memfilter berdasarkan kategori, status komisi, event, dan hari hadir, **agar** saya cepat menemukan kreator yang saya cari.

**Kriteria penerimaan**
- [ ] Kartu kreator menampilkan avatar, nama, kategori, 3 thumbnail karya, badge event, nomor booth.
- [ ] Filter bisa dikombinasikan dan tersimpan di URL (query string) agar bisa dibagikan.
- [ ] Urutan: terbaru, pengikut terbanyak, nomor booth.
- [ ] Hasil kosong menampilkan pesan dan tombol reset filter.
- [ ] Halaman tampil < 2 detik dengan 200 data kreator dummy.

### US-13 — Halaman event `FR-08` · S · 3 SP
**Sebagai** pengunjung, **saya ingin** membuka halaman event yang berisi daftar kreator hadir dan galeri foto event, **agar** saya bisa merencanakan kunjungan.

**Kriteria penerimaan**
- [ ] Menampilkan info event, daftar kreator (pakai komponen kartu direktori), dan galeri foto yang bertag event tersebut.

---

## Epic E4 — Forum Diskusi (gaya Kaskus)

### US-14 — Admin mengelola board `FR-09` · S · 2 SP
**Sebagai** admin, **saya ingin** membuat dan mengurutkan board diskusi, **agar** topik obrolan terorganisasi.

**Kriteria penerimaan**
- [ ] CRUD board: nama, slug, deskripsi, urutan.

### US-15 — Membuat thread dan membalas `FR-09` · S · 5 SP
**Sebagai** anggota, **saya ingin** membuat thread dan membalas thread orang lain, **agar** saya bisa berdiskusi dengan komunitas.

**Kriteria penerimaan**
- [ ] Thread: judul (maks 120 karakter), isi, gambar opsional.
- [ ] Balasan bisa membalas balasan lain (1 tingkat bersarang).
- [ ] Penulis thread menerima notifikasi saat ada balasan.

### US-16 — Upvote & urutkan thread `FR-09` · S · 3 SP
**Sebagai** anggota, **saya ingin** memberi upvote dan mengurutkan thread berdasarkan terbaru atau terpopuler, **agar** diskusi yang bermanfaat mudah ditemukan.

**Kriteria penerimaan**
- [ ] Satu user hanya bisa upvote sekali per thread/balasan (bisa dibatalkan).
- [ ] Urutan "Terpopuler" berdasarkan jumlah upvote dalam 7 hari terakhir.

### US-17 — Moderasi thread `FR-09` · S · 2 SP
**Sebagai** moderator, **saya ingin** menyematkan, mengunci, dan menghapus thread, **agar** forum tetap tertib.

**Kriteria penerimaan**
- [ ] Thread tersemat selalu tampil di atas.
- [ ] Thread terkunci tidak bisa dibalas, dengan label "Dikunci".

---

## Epic E5 — Kepercayaan & Keamanan

### US-18 — Verifikasi kreator `FR-10` · S · 3 SP
**Sebagai** kreator, **saya ingin** mengajukan verifikasi, **agar** pengunjung yakin akun saya asli.

**Kriteria penerimaan**
- [ ] Form pengajuan dengan tautan bukti; admin menyetujui/menolak.
- [ ] Akun terverifikasi mendapat ikon centang di profil, kartu direktori, dan komentar.

### US-19 — Melaporkan pencurian karya `FR-11` · S · 3 SP
**Sebagai** kreator, **saya ingin** melaporkan postingan yang mencuri karya saya, **agar** admin bisa menindaknya.

**Kriteria penerimaan**
- [ ] Kategori laporan baru "Pencurian karya / hak cipta" dengan field tautan karya asli.
- [ ] Laporan masuk antrian admin dan pelapor mendapat notifikasi saat laporan diproses.

### US-20 — Admin menindak laporan `bawaan + FR-11` · M · 3 SP
**Sebagai** admin, **saya ingin** melihat antrian laporan dan mengambil tindakan, **agar** konten melanggar cepat ditangani.

**Kriteria penerimaan**
- [ ] Aksi: abaikan, sembunyikan konten, peringatkan user, nonaktifkan akun.
- [ ] Setiap aksi tercatat (siapa, kapan, alasan).

---

## Epic E6 — Fitur Tambahan (Could)

### US-21 — Watermark otomatis `FR-12` · C · 5 SP
**Sebagai** illustrator, **saya ingin** menambahkan watermark username secara otomatis saat unggah, **agar** karya saya lebih sulit dicuri.

### US-22 — Rencana kunjungan booth `FR-13` · C · 3 SP
**Sebagai** pengunjung, **saya ingin** menyimpan kreator favorit ke daftar "Rencana Kunjungan", **agar** saat di event saya tahu booth mana saja yang ingin didatangi.

### US-23 — QR code profil `FR-14` · C · 2 SP
**Sebagai** kreator, **saya ingin** mengunduh QR code profil saya, **agar** bisa dicetak dan dipajang di booth.

---

## Ringkasan Story Point

| Epic | Must | Should | Could | Total |
|---|---|---|---|---|
| E1 Akun & Profil | 8 | 3 | – | 11 |
| E2 Foto & Interaksi | 5 | 5 | – | 10 |
| E3 Event & Direktori | 18 | 3 | – | 21 |
| E4 Forum | – | 12 | – | 12 |
| E5 Keamanan | 3 | 6 | – | 9 |
| E6 Tambahan | – | – | 10 | 10 |
| **Total** | **34** | **29** | **10** | **73** |
