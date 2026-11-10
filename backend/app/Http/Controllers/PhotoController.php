<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Notification;
use App\Models\Photo;
use App\Models\User;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PhotoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $viewer = $request->user();
        $query = Photo::query()->with(['user', 'album']);

        if ($tag = $request->query('tag')) {
            $query->whereJsonContains('hashtags', Str::lower(ltrim($tag, '#')));
        }

        if ($username = $request->query('username')) {
            $user = User::where('username', $username)->first();
            if (! $user) {
                return response()->json(['data' => [], 'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 0]]);
            }
            $query->where('user_id', $user->id);
        }

        if ($request->query('scope') === 'following') {
            if (! $viewer) {
                return response()->json(['message' => 'Masuk untuk melihat feed pengikut.'], 401);
            }
            $ids = $viewer->following()->pluck('following_id');
            $query->whereIn('user_id', $ids->push($viewer->id));
        }

        $photos = $query->latest('id')->paginate(12)->withQueryString();

        return response()->json([
            'data' => collect($photos->items())->map(fn (Photo $photo) => Presenter::photo($photo, $viewer)),
            'meta' => [
                'current_page' => $photos->currentPage(),
                'last_page' => $photos->lastPage(),
                'total' => $photos->total(),
                'per_page' => $photos->perPage(),
            ],
        ]);
    }

    public function show(Request $request, Photo $photo): JsonResponse
    {
        $photo->load(['user', 'album', 'comments.user']);
        $viewer = $request->user();

        return response()->json([
            'photo' => Presenter::photo($photo, $viewer),
            'comments' => $photo->comments->map(fn ($comment) => [
                ...Presenter::comment($comment),
                'can_delete' => $viewer ? ($viewer->id === $comment->user_id || $viewer->id === $photo->user_id) : false,
            ]),
            'more_from_user' => $photo->user->photos()
                ->where('id', '!=', $photo->id)
                ->limit(3)
                ->get()
                ->map(fn (Photo $item) => Presenter::photo($item, $viewer)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'images' => ['required', 'array', 'min:1', 'max:10'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp,gif', 'max:15360'],
            'caption' => ['nullable', 'string', 'max:2200'],
            'album_title' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'string', 'max:300'],
        ], [
            'images.required' => 'Pilih minimal satu foto untuk diunggah.',
            'images.max' => 'Satu unggahan maksimal 10 foto.',
            'images.*.image' => 'File yang diunggah harus berupa gambar.',
            'images.*.mimes' => 'Format gambar harus JPG, PNG, WEBP, atau GIF.',
            'images.*.max' => 'Ukuran setiap foto maksimal 15 MB.',
            'caption.max' => 'Caption maksimal 2200 karakter.',
        ]);

        $files = $request->file('images');
        $album = null;

        if (count($files) > 1 || ! empty($data['album_title'])) {
            $album = Album::create([
                'user_id' => $user->id,
                'title' => $data['album_title'] ?: 'Album tanpa judul',
                'caption' => $data['caption'] ?? null,
            ]);
        }

        $caption = $data['caption'] ?? null;
        $hashtags = $this->extractHashtags($caption, $data['tags'] ?? '');
        $created = [];

        foreach ($files as $file) {
            if ($user->photos()->count() >= 300) {
                break;
            }

            $path = $file->store('photos/'.date('Y/m'), 'uploads');

            $photo = Photo::create([
                'user_id' => $user->id,
                'album_id' => $album?->id,
                'path' => $path,
                'caption' => $caption,
                'hashtags' => $hashtags,
            ]);

            $created[] = Presenter::photo($photo->fresh(['user', 'album']), $user);
        }

        if (count($created) === 0) {
            return response()->json(['message' => 'Batas 300 karya tercapai. Hapus beberapa karya lama dulu.'], 422);
        }

        $this->notifyFollowersOfNewWork($user, $created[0]['id'], count($created));

        return response()->json([
            'message' => count($created) > 1
                ? count($created).' foto berhasil diunggah.'
                : 'Karya berhasil diunggah.',
            'photos' => $created,
        ], 201);
    }

    public function destroy(Request $request, Photo $photo): JsonResponse
    {
        if ($photo->user_id !== $request->user()->id && ! $request->user()->is_admin) {
            return response()->json(['message' => 'Kamu hanya bisa menghapus karyamu sendiri.'], 403);
        }

        $album = $photo->album;
        $photo->deleteFiles();
        $photo->delete();

        if ($album && $album->photos()->count() === 0) {
            $album->delete();
        }

        return response()->json(['message' => 'Karya dihapus.']);
    }

    public function like(Request $request, Photo $photo): JsonResponse
    {
        $user = $request->user();

        if (! $photo->likes()->where('user_id', $user->id)->exists()) {
            $photo->likes()->create(['user_id' => $user->id]);
            $photo->increment('like_count');
            $photo->refresh();

            if ($photo->user_id !== $user->id) {
                Notification::create([
                    'user_id' => $photo->user_id,
                    'actor_id' => $user->id,
                    'type' => 'like',
                    'photo_id' => $photo->id,
                    'data' => ['message' => $user->name.' menyukai karyamu.'],
                ]);
            }
        }

        return response()->json(['liked' => true, 'like_count' => $photo->like_count]);
    }

    public function unlike(Request $request, Photo $photo): JsonResponse
    {
        $deleted = $photo->likes()->where('user_id', $request->user()->id)->delete();

        if ($deleted) {
            $photo->decrement('like_count');
            $photo->refresh();
        }

        return response()->json(['liked' => false, 'like_count' => max(0, $photo->like_count)]);
    }

    private function extractHashtags(?string $caption, string $extra): array
    {
        $tags = [];

        if ($caption && preg_match_all('/#([\p{L}\p{N}_]+)/u', $caption, $matches)) {
            $tags = $matches[1];
        }

        foreach (preg_split('/[\s,]+/', $extra) as $tag) {
            $tag = trim($tag);
            if ($tag !== '') {
                $tags[] = $tag;
            }
        }

        return collect($tags)
            ->map(fn ($tag) => Str::lower(ltrim(trim($tag), '#')))
            ->filter(fn ($tag) => $tag !== '')
            ->unique()
            ->take(10)
            ->values()
            ->all();
    }

    private function notifyFollowersOfNewWork(User $user, int $photoId, int $count): void
    {
        $followers = $user->followers()->pluck('follower_id');

        if ($followers->isEmpty()) {
            return;
        }

        $now = now();
        $rows = $followers->map(fn ($followerId) => [
            'user_id' => $followerId,
            'actor_id' => $user->id,
            'type' => 'new_photo',
            'photo_id' => $photoId,
            'data' => json_encode(['message' => $user->name.' membagikan '.($count > 1 ? $count.' karya baru.' : 'karya baru.')]),
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        Notification::insert($rows);
    }
}
