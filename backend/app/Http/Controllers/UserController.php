<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function show(Request $request, string $username): JsonResponse
    {
        $user = User::with('creatorProfile')
            ->withCount(['photos', 'followers', 'following'])
            ->where('username', $username)
            ->firstOrFail();

        $viewer = $request->user();
        $photos = $user->photos()->with(['user', 'album'])->latest('id')->paginate(12);

        return response()->json([
            'user' => Presenter::user($user, $viewer),
            'photos' => collect($photos->items())->map(fn ($photo) => Presenter::photo($photo, $viewer)),
            'meta' => [
                'current_page' => $photos->currentPage(),
                'last_page' => $photos->lastPage(),
                'total' => $photos->total(),
            ],
        ]);
    }

    public function photos(Request $request, string $username): JsonResponse
    {
        $user = User::where('username', $username)->firstOrFail();
        $photos = $user->photos()->with(['user', 'album'])->latest('id')->paginate(12);

        return response()->json([
            'data' => collect($photos->items())->map(fn ($photo) => Presenter::photo($photo, $request->user())),
            'meta' => [
                'current_page' => $photos->currentPage(),
                'last_page' => $photos->lastPage(),
                'total' => $photos->total(),
            ],
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'creators' => User::where('is_creator', true)->count(),
            'photos' => \App\Models\Photo::count(),
            'appreciations' => (int) \App\Models\Like::count(),
            'events' => \App\Models\Event::count(),
        ]);
    }

    public function meta(): JsonResponse
    {
        return response()->json([
            'categories' => \App\Models\CreatorProfile::CATEGORIES,
            'commission_options' => [
                ['value' => 'open', 'label' => 'Komisi buka'],
                ['value' => 'closed', 'label' => 'Komisi tutup'],
            ],
        ]);
    }
}
