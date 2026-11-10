<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Comment;
use App\Models\CreatorProfile;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Follow;
use App\Models\Like;
use App\Models\Notification;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    private array $creators = [
        [
            'name' => 'Nara Kinasih', 'username' => 'narakinasih', 'city' => 'Jakarta',
            'categories' => ['Illustrator'], 'commission_open' => true,
            'description' => 'Menggambar cerita kecil tentang manusia, alam, dan hal-hal yang hampir terlupa.',
            'links' => ['instagram' => 'narakinasih', 'x' => 'narakinasih', 'website' => 'https://narakinasih.example.com'],
            'booth' => 'B-12',
        ],
        [
            'name' => 'Kuro Atelier', 'username' => 'kuroatelier', 'city' => 'Bandung',
            'categories' => ['Crafter'], 'commission_open' => false,
            'description' => 'Handmade charms & benda mungil untuk petualangan sehari-hari.',
            'links' => ['instagram' => 'kuroatelier'],
            'booth' => 'A-08',
        ],
        [
            'name' => 'Ayu Prameswari', 'username' => 'ayucosplay', 'city' => 'Yogyakarta',
            'categories' => ['Cosplayer'], 'commission_open' => true,
            'description' => 'Cosplayer, pembuat prop, dan penakluk wig kusut ✨',
            'links' => ['instagram' => 'ayucosplay', 'tiktok' => 'ayucosplay'],
            'booth' => 'C-21',
        ],
        [
            'name' => 'Bima R. Putra', 'username' => 'bimaframe', 'city' => 'Surabaya',
            'categories' => ['Fotografer'], 'commission_open' => true,
            'description' => 'Menangkap momen yang tak sengaja terasa seperti rumah.',
            'links' => ['instagram' => 'bimaframe', 'website' => 'https://bimaframe.example.com'],
            'booth' => 'D-04',
        ],
        [
            'name' => 'Lumi Studio', 'username' => 'lumistudio', 'city' => 'Malang',
            'categories' => ['Illustrator'], 'commission_open' => false,
            'description' => 'Warna hangat, hari yang lebih lembut. Ilustrasi digital & buku cerita.',
            'links' => ['instagram' => 'lumistudio'],
            'booth' => 'B-03',
        ],
        [
            'name' => 'Sora Makes', 'username' => 'soramakes', 'city' => 'Jakarta',
            'categories' => ['Crafter', 'Lainnya'], 'commission_open' => true,
            'description' => 'Merajut benda-benda mungil dengan banyak cinta.',
            'links' => ['instagram' => 'soramakes'],
            'booth' => 'A-14',
        ],
        [
            'name' => 'Raka Wijaya', 'username' => 'rakawijaya', 'city' => 'Semarang',
            'categories' => ['Fotografer', 'Illustrator'], 'commission_open' => true,
            'description' => 'Foto jalanan dan sketsa tinta dari sudut kota yang sepi.',
            'links' => ['instagram' => 'rakawijaya', 'x' => 'rakawijaya'],
            'booth' => 'D-11',
        ],
        [
            'name' => 'Miel Arts', 'username' => 'mielarts', 'city' => 'Denpasar',
            'categories' => ['Illustrator'], 'commission_open' => false,
            'description' => 'Karakter gemas, warna pastel, dan sedikit sihir laut.',
            'links' => ['instagram' => 'mielarts', 'tiktok' => 'mielarts'],
            'booth' => 'B-07',
        ],
        [
            'name' => 'Dinda Ayu', 'username' => 'dindacos', 'city' => 'Solo',
            'categories' => ['Cosplayer', 'Crafter'], 'commission_open' => true,
            'description' => 'Cosplay dari kain perca, plus aksesori buatan tangan.',
            'links' => ['instagram' => 'dindacos'],
            'booth' => 'C-05',
        ],
        [
            'name' => 'Vega Prints', 'username' => 'vegaprints', 'city' => 'Bandung',
            'categories' => ['Lainnya'], 'commission_open' => true,
            'description' => 'Cetak linocut & risograph edisi terbatas.',
            'links' => ['instagram' => 'vegaprints', 'website' => 'https://vegaprints.example.com'],
            'booth' => 'E-02',
        ],
    ];

    private array $captions = [
        'Studi warna untuk seri baru. Masih cari komposisi yang pas.',
        'Selesai juga akhirnya. Butuh 14 jam dan tiga cangkir kopi.',
        'Latihan gestur tangan sebelum masuk ke karya utama.',
        'Langit sore di sudut kota, direkam apa adanya.',
        'Bahan kulit sintetis sisa produksi, jadi tas mini pertama.',
        'Kostum ini akhirnya selesai juga. Detail sayapnya paling lama.',
        'Cetakan pertama, masih ada serat kertas yang tertinggal.',
        'Sketsa cepat sambil menunggu hujan reda.',
        'Eksperimen palet hangat untuk zine bulan depan.',
        'Terima kasih semua yang datang ke booth kemarin!',
        'Potret teman di taman, cahaya kebetulan bagus.',
        'Aksesori baru: gantungan kunci resin dan bunga kering.',
        'Salah satu halaman dari buku cerita yang sedang digarap.',
        'Warna favorit bulan ini: hijau lumut dan oranye bakar.',
        'Uji coba komposisi diagonal. Hasilnya lumayan.',
        'Detail bordir yang butuh dua malam untuk diselesaikan.',
        'Karya lama yang akhirnya berani saya unggah.',
        'Kertas daur ulang, tinta kedelai, dan banyak kesabaran.',
        'Karakter baru: penjaga mercusuar yang takut air.',
        'Sesi foto golden hour di atap gedung.',
        'Latihan proporsi sebelum lanjut ke komik pendek.',
        'Cetakan edisi 20, semuanya ditandatangani manual.',
        'Wig restyle pertama yang menurutku cukup berhasil.',
        'Miniatur booth untuk latihan display Comipara nanti.',
        'Studi tekstur kain untuk kostum berikutnya.',
        'Kumpulan thumbnail yang tidak jadi dipakai.',
        'Papan warna untuk komisi batch Desember.',
        'Momen kecil yang rasanya sayang kalau dilewatkan.',
        'Eksperimen cetak dua lapis, hasilnya jadi kebiruan.',
        'Terima kasih sudah mampir dan bilang halo.',
    ];

    private array $tagSets = [
        ['ilustrasi', 'karyalokal'],
        ['sketsa', 'proses'],
        ['cosplay', 'handmade'],
        ['fotografi', 'kotaku'],
        ['craft', 'handmade'],
        ['zine', 'printmaking'],
        ['warna', 'studibentuk'],
        ['comipara', 'kreatorlokal'],
    ];

    private array $commentBodies = [
        'Karyanya hangat banget, suka paletnya!',
        'Detail kecilnya bikin betah lihat lama-lama.',
        'Booth kamu di mana nanti? Mau mampir.',
        'Ini teknik manual atau digital?',
        'Wah, komposisinya rapi. Boleh belajar dari mana?',
        'Semangat terus, karyanya makin matang.',
        'Warna kulitnya pas banget, susah lho itu.',
        'Sudah follow dari lama, senang akhirnya lihat prosesnya.',
        'Boleh minta versi cetaknya?',
        'Keren, ini yang bikin komunitas lokal hidup.',
    ];

    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@kreatorpara.id'],
            [
                'name' => 'Admin Comipara',
                'username' => 'admin',
                'password' => Hash::make('admin12345'),
                'bio' => 'Mengurus direktori kreator dan event Comipara.',
                'is_admin' => true,
                'is_creator' => false,
                'email_verified_at' => now(),
            ]
        );

        $users = [];

        foreach ($this->creators as $index => $data) {
            $user = User::firstOrCreate(
                ['email' => $data['username'].'@kreatorpara.id'],
                [
                    'name' => $data['name'],
                    'username' => $data['username'],
                    'password' => Hash::make('password'),
                    'bio' => $data['description'],
                    'is_creator' => true,
                    'email_verified_at' => now(),
                ]
            );

            if (! $user->avatar_path) {
                $path = 'avatars/demo-'.$data['username'].'.jpg';
                DemoArt::avatar(public_path('uploads/'.$path), $index + 3);
                $user->forceFill(['avatar_path' => $path])->save();
            }

            CreatorProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'categories' => $data['categories'],
                    'city' => $data['city'],
                    'commission_open' => $data['commission_open'],
                    'description' => $data['description'],
                    'links' => $data['links'],
                ]
            );

            $users[] = $user;
        }

        $users = collect($users);

        $event = Event::firstOrCreate(
            ['slug' => 'comipara-2026'],
            [
                'title' => 'Comipara 2026',
                'description' => 'Pameran dan bazar kreator lokal: ilustrasi, cosplay, fotografi, dan kerajinan tangan. Temui langsung kreator favoritmu.',
                'location' => 'Jakarta Convention Center, Hall B',
                'starts_at' => '2026-12-12',
                'ends_at' => '2026-12-13',
            ]
        );

        $pastEvent = Event::firstOrCreate(
            ['slug' => 'comipara-mini-bandung'],
            [
                'title' => 'Comipara Mini Bandung',
                'description' => 'Edisi kecil Comipara di Bandung: 40 kreator, satu hari penuh workshop.',
                'location' => 'Gedung Sate, Bandung',
                'starts_at' => '2026-06-20',
                'ends_at' => '2026-06-21',
            ]
        );

        // Kehadiran: 8 disetujui, 1 menunggu, 1 ditolak
        foreach ($users as $index => $user) {
            $status = match (true) {
                $index === 8 => 'pending',
                $index === 9 => 'rejected',
                default => 'approved',
            };

            EventAttendance::updateOrCreate(
                ['event_id' => $event->id, 'user_id' => $user->id],
                [
                    'booth_number' => $this->creators[$index]['booth'],
                    'status' => $status,
                    'reviewed_at' => $status === 'pending' ? null : now()->subDays(3),
                ]
            );
        }

        foreach ($users->take(3) as $index => $user) {
            EventAttendance::updateOrCreate(
                ['event_id' => $pastEvent->id, 'user_id' => $user->id],
                [
                    'booth_number' => 'M-'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                    'status' => 'approved',
                    'reviewed_at' => Carbon::parse('2026-06-10'),
                ]
            );
        }

        // 30 karya, tiga per kreator. Satu album berisi dua foto.
        $photoIndex = 0;
        $album = null;

        foreach ($users as $index => $user) {
            for ($i = 0; $i < 3; $i++) {
                $caption = $this->captions[($index * 3 + $i) % count($this->captions)];
                $path = 'photos/demo/karya-'.str_pad((string) ($photoIndex + 1), 2, '0', STR_PAD_LEFT).'.jpg';

                if (! file_exists(public_path('uploads/'.$path))) {
                    DemoArt::photo(public_path('uploads/'.$path), $photoIndex + 1);
                }

                if ($index === 2 && $i === 0) {
                    $album = Album::firstOrCreate(
                        ['user_id' => $user->id, 'title' => 'Seri Kostum Musim Panas'],
                        ['caption' => 'Dokumentasi kostum terbaru, dari pola sampai fitting.']
                    );
                }

                $photo = Photo::firstOrCreate(
                    ['path' => $path],
                    [
                        'user_id' => $user->id,
                        'album_id' => ($index === 2 && $i < 2) ? $album?->id : null,
                        'caption' => $caption,
                        'hashtags' => $this->tagSets[($index + $i) % count($this->tagSets)],
                        'created_at' => now()->subDays(30 - $photoIndex)->subHours($index),
                        'updated_at' => now()->subDays(30 - $photoIndex)->subHours($index),
                    ]
                );

                $photoIndex++;
            }
        }

        // Suka & komentar
        $allPhotos = Photo::all();
        mt_srand(20261212);

        foreach ($allPhotos as $photo) {
            $likers = $users->filter(fn (User $u) => $u->id !== $photo->user_id)
                ->shuffle()
                ->take(mt_rand(2, 6));

            foreach ($likers as $liker) {
                Like::firstOrCreate(['user_id' => $liker->id, 'photo_id' => $photo->id]);
            }

            $photo->forceFill(['like_count' => $likers->count()])->save();
        }

        $commentedPhotos = $allPhotos->random(10);

        foreach ($commentedPhotos as $photo) {
            $commenters = $users->filter(fn (User $u) => $u->id !== $photo->user_id)->take(2);

            foreach ($commenters as $n => $commenter) {
                Comment::create([
                    'user_id' => $commenter->id,
                    'photo_id' => $photo->id,
                    'body' => $this->commentBodies[($photo->id + $n) % count($this->commentBodies)],
                    'created_at' => $photo->created_at->addHours(3 + $n),
                    'updated_at' => $photo->created_at->addHours(3 + $n),
                ]);
            }

            $photo->forceFill(['comment_count' => $photo->comments()->count()])->save();
        }

        // Follow
        foreach ($users as $index => $user) {
            $targets = $users->filter(fn (User $u) => $u->id !== $user->id)
                ->shuffle()
                ->take(3 + ($index % 3));

            foreach ($targets as $target) {
                Follow::firstOrCreate(['follower_id' => $user->id, 'following_id' => $target->id]);
            }
        }

        // Notifikasi contoh untuk kreator pertama
        $first = $users[0];
        if ($first->notifications()->count() === 0) {
            Notification::create([
                'user_id' => $first->id,
                'actor_id' => $admin->id,
                'type' => 'attendance_approved',
                'data' => ['message' => 'Kehadiranmu di Comipara 2026 disetujui · Booth B-12.'],
                'read_at' => null,
            ]);
            Notification::create([
                'user_id' => $first->id,
                'actor_id' => $users[2]->id,
                'type' => 'like',
                'photo_id' => $first->photos()->first()?->id,
                'data' => ['message' => $users[2]->name.' menyukai karyamu.'],
                'read_at' => null,
            ]);
            Notification::create([
                'user_id' => $first->id,
                'actor_id' => $users[3]->id,
                'type' => 'follow',
                'data' => ['message' => $users[3]->name.' mulai mengikuti kamu.'],
                'read_at' => now()->subDay(),
            ]);
        }

        $this->command?->info('Demo siap: 10 kreator, '.Photo::count().' karya, 2 event, akun admin & kreator (sandi: password).');
    }
}
