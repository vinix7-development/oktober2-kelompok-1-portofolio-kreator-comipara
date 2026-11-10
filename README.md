# KreatorPara

Platform direktori dan portofolio interaktif untuk kreator lokal yang hadir di Comipara. Pengunjung dapat menjelajahi karya, menyukai dan mengomentari foto, mengikuti kreator, serta mencari kreator berdasarkan kategori, status komisi, dan event.

> Proyek menggunakan backend Laravel dan frontend Next.js yang tersedia di repo ini. Pixelfed tidak digunakan.

## Fitur

- Feed karya dengan caption, hashtag, unggahan satu foto atau album (maksimal 10 foto; 15 MB per foto).
- Like, komentar, follow, dan notifikasi aktivitas.
- Akun dan profil portofolio kreator: kategori, kota, status komisi, bio, tautan sosial, serta karya.
- Event Comipara, pendaftaran booth, persetujuan admin, dan badge kehadiran di profil.
- Direktori dengan pencarian nama/kota/deskripsi dan filter kategori, status komisi, event, serta pengurutan.
- Panel admin untuk mengelola event dan meninjau pendaftaran booth.
- Sepuluh akun kreator demo, minimal 30 karya ilustrasi demo yang dibuat lokal saat database di-seed.

## Teknologi

- **Backend:** PHP 8.3+, Laravel 13, API JSON dengan bearer token
- **Frontend:** Node.js 20.9+, Next.js 16, React 19, TypeScript
- **Database:** SQLite (paling sederhana) atau MySQL/MariaDB
- **Unggahan:** disimpan di `backend/public/uploads`

## Prasyarat

Pasang dan pastikan perintah berikut tersedia:

- PHP 8.3+ dengan ekstensi `fileinfo`, `gd`, `mbstring`, `pdo`, dan driver PDO untuk database pilihan
- Composer 2
- Node.js 20.9+ dan npm
- SQLite beserta `pdo_sqlite`, **atau** server MySQL/MariaDB yang berjalan

Periksa instalasi:

```bash
php -v
composer --version
node --version
npm --version
```

## Menjalankan secara lokal

Buka dua terminal dari direktori root proyek.

### 1. Siapkan backend Laravel

```bash
cd backend
composer install
```

Buat `.env` dari template jika belum ada:

```bash
cp .env.example .env
```

Buat application key dan atur URL/locale:

```bash
php artisan key:generate
```

Di `backend/.env`, gunakan pengaturan berikut untuk development lokal:

```dotenv
APP_NAME=KreatorPara
APP_URL=http://127.0.0.1:8000
APP_LOCALE=id
APP_FALLBACK_LOCALE=id
```

#### Pilihan A — SQLite

Pastikan ekstensi `pdo_sqlite` aktif. Dari folder `backend`, buat file database bila belum tersedia:

```bash
touch database/database.sqlite
```

Atur koneksi di `backend/.env`:

```dotenv
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

> Jika PHP-mu tidak menyediakan `pdo_sqlite`, gunakan pilihan MySQL di bawah.

#### Pilihan B — MySQL atau MariaDB

Buat database kosong, misalnya `kreatorpara`, lalu atur `backend/.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kreatorpara
DB_USERNAME=root
DB_PASSWORD=
```

Isi `DB_USERNAME` dan `DB_PASSWORD` sesuai konfigurasi lokal.

#### Migrasi, akun demo, dan API

Dari folder `backend`:

```bash
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Seeder membuat karya demo dan gambar avatar secara lokal dengan ekstensi GD—tidak perlu mengunduh gambar dari luar.

> **Peringatan:** `php artisan migrate:fresh --seed` menghapus semua tabel dan data di database terpilih sebelum membuat ulang skema dan data demo. Gunakan hanya pada database development.

API tersedia di `http://127.0.0.1:8000/api`. Endpoint pemeriksaan cepat: `GET /api/stats`.

### 2. Jalankan frontend Next.js

Di terminal kedua, dari direktori root proyek:

```bash
cd frontend
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Frontend secara default mengirim request ke `http://127.0.0.1:8000/api`.

Jika backend berjalan di alamat lain, buat `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Restart `npm run dev` setelah mengubah variabel tersebut. Origin frontend development yang diizinkan oleh CORS backend adalah `localhost` dan `127.0.0.1` pada port 3000 (dan 3001 untuk pengembangan tambahan).

## Akun demo

| Peran | Email | Kata sandi |
|---|---|---|
| Admin | `admin@kreatorpara.id` | `admin12345` |
| Kreator | `narakinasih@kreatorpara.id` | `password` |
| Kreator | `kuroatelier@kreatorpara.id` | `password` |
| Kreator lain | alamat email `<username>@kreatorpara.id` | `password` |

Seeder menyediakan 10 kreator. Kata sandi demo hanya untuk pengembangan lokal—jangan gunakan di server produksi.

## Halaman utama

| URL | Keterangan |
|---|---|
| `/` | Beranda dan feed karya |
| `/direktori` | Pencarian/filter kreator |
| `/event` | Daftar event Comipara |
| `/event/{slug}` | Detail event dan pendaftaran booth |
| `/u/{username}` | Profil dan portofolio kreator |
| `/foto/{id}` | Detail karya, like, dan komentar |
| `/daftar` | Pendaftaran akun |
| `/masuk` | Login |
| `/unggah` | Unggah karya atau album |
| `/pengaturan` | Pengaturan profil dan status kreator |
| `/notifikasi` | Notifikasi akun |
| `/admin` | Panel admin; hanya untuk akun admin |

## API ringkas

Semua endpoint API memakai prefix `/api` dan mengembalikan JSON. Endpoint privat menerima header:

```http
Authorization: Bearer <token>
Accept: application/json
```

Beberapa endpoint yang tersedia:

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/register`, `/api/login` | Membuat akun / login |
| `GET` | `/api/feed`, `/api/direktori`, `/api/events` | Feed, direktori, daftar event |
| `GET` | `/api/users/{username}` | Profil dan karya kreator |
| `POST` | `/api/photos` | Unggah foto atau album |
| `POST` / `DELETE` | `/api/photos/{photo}/like` | Suka / batalkan suka |
| `POST` | `/api/photos/{photo}/comments` | Tambahkan komentar |
| `POST` / `DELETE` | `/api/users/{username}/follow` | Ikuti / berhenti mengikuti |
| `POST` | `/api/events/{event}/attendance` | Daftar booth event |
| `POST` | `/api/admin/events` | Buat event (admin) |
| `GET` | `/api/admin/attendances` | Daftar pendaftaran booth (admin) |
| `PATCH` | `/api/admin/attendances/{attendance}` | Setujui/tolak booth (admin) |

`POST /api/photos` menerima `multipart/form-data`; lampirkan satu sampai sepuluh file di field `images[]`, dan boleh menyertakan `caption`, `tags`, serta `album_title`.

## Pengembangan dan pemeriksaan

Frontend:

```bash
cd frontend
npm run lint
npx tsc -p tsconfig.json --noEmit
npm run build
```

Backend:

```bash
cd backend
php artisan route:list
php artisan test
```

## Catatan konfigurasi dan keamanan

- File environment (`backend/.env`, `frontend/.env.local`) berisi konfigurasi lokal dan jangan dimasukkan ke commit.
- Token API disimpan sebagai hash di database; frontend menyimpan bearer token di `localStorage`.
- Validasi upload dilakukan di server: gambar JPG, PNG, WEBP, atau GIF dengan batas ukuran per foto 15 MB.
- Atur CORS, HTTPS, kredensial database, backup, dan akun admin sebelum deployment. Jangan gunakan kredensial demo di production.
- Aplikasi ini tidak menggunakan Pixelfed atau federasi ActivityPub.

## Alur demo singkat

1. Buka `/direktori`, pilih kategori **Cosplayer**, lalu buka profil **Ayu Prameswari** dan tekan **Ikuti**.
2. Buka salah satu karya, tekan **Sukai**, lalu kirim komentar.
3. Masuk sebagai kreator, buka `/pengaturan`, lengkapi kategori dan status komisi, lalu unggah karya di `/unggah`.
4. Buka `/event/comipara-2026`, daftarkan nomor booth dari akun kreator.
5. Masuk sebagai admin, buka `/admin`, setujui pendaftaran booth, lalu periksa badge kehadiran di profil kreator.

## Pemecahan masalah

- **Frontend menampilkan pesan tidak bisa terhubung ke server.** Pastikan `php artisan serve` berjalan di port 8000 dan `NEXT_PUBLIC_API_URL` menunjuk ke `/api` backend.
- **Gambar unggahan tidak tampil.** Pastikan folder `backend/public/uploads` ada dan dapat ditulis. Seeder mengisi gambar demo ke folder tersebut; tidak diperlukan `php artisan storage:link`.
- **Permintaan dari browser diblokir CORS.** Jalankan frontend di `http://localhost:3000` atau `http://127.0.0.1:3000`. Origin lain perlu ditambahkan di `backend/config/cors.php`.
- **`could not find driver` saat migrasi.** Ekstensi PDO untuk database belum aktif. Aktifkan `pdo_sqlite`, atau gunakan MySQL dengan `pdo_mysql`.
- **`Access denied` pada MySQL.** Periksa `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD`; buat database kosong terlebih dahulu.
- **Perubahan data demo ingin diulang.** Jalankan `php artisan migrate:fresh --seed` dari folder `backend` (menghapus seluruh data di database development).

## Struktur direktori

```text
backend/     Laravel API, migrations, models, seeders, dan file unggahan lokal
frontend/    Aplikasi Next.js, halaman UI, komponen, dan klien API
PRD.md       Kebutuhan produk
STORY.md     User story dan kriteria penerimaan
TASK.md      Rincian tugas proyek
ROADMAP.md   Jadwal sprint dan roadmap
KANBAN.md    Papan kerja
TEAM-PLANNING.md  Pembagian dan rencana tim
```
