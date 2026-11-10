<?php

namespace App\Http\Controllers;

use App\Models\CreatorProfile;
use App\Models\Event;
use App\Models\User;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $viewer = $request->user();

        $query = User::query()
            ->where('is_creator', true)
            ->with('creatorProfile')
            ->withCount(['photos', 'followers'])
            ->with([
                'photos' => fn ($q) => $q->with('album')->latest('id')->limit(3),
                'approvedAttendances' => fn ($q) => $q->with('event')->latest('id'),
            ]);

        if ($search = trim((string) $request->query('q'))) {
            $query->where(function ($inner) use ($search) {
                $like = '%'.$search.'%';
                $inner->where('name', 'like', $like)
                    ->orWhere('username', 'like', $like)
                    ->orWhereHas('creatorProfile', function ($profile) use ($like) {
                        $profile->where('city', 'like', $like)
                            ->orWhere('description', 'like', $like);
                    });
            });
        }

        if ($category = $request->query('category')) {
            if (in_array($category, CreatorProfile::CATEGORIES, true)) {
                $query->whereHas('creatorProfile', fn ($q) => $q->whereJsonContains('categories', $category));
            }
        }

        $commission = $request->query('commission');
        if ($commission === 'open') {
            $query->whereHas('creatorProfile', fn ($q) => $q->where('commission_open', true));
        } elseif ($commission === 'closed') {
            $query->whereHas('creatorProfile', fn ($q) => $q->where('commission_open', false));
        }

        if ($eventId = $request->query('event')) {
            $query->whereHas('attendances', fn ($q) => $q
                ->where('event_id', $eventId)
                ->where('status', 'approved'));
        }

        $sort = $request->query('sort', 'name');
        match ($sort) {
            'newest' => $query->latest('id'),
            'followers' => $query->orderByDesc('followers_count'),
            default => $query->orderBy('name'),
        };

        $creators = $query->paginate(9)->withQueryString();

        return response()->json([
            'data' => collect($creators->items())->map(fn (User $user) => [
                ...Presenter::user($user, $viewer),
                'latest_photos' => $user->photos->map(fn ($photo) => Presenter::photo($photo, $viewer)),
            ]),
            'meta' => [
                'current_page' => $creators->currentPage(),
                'last_page' => $creators->lastPage(),
                'total' => $creators->total(),
                'per_page' => $creators->perPage(),
            ],
            'filters' => $this->filterOptions(),
        ]);
    }

    private function filterOptions(): array
    {
        return [
            'categories' => CreatorProfile::CATEGORIES,
            'events' => Event::orderByDesc('starts_at')
                ->get()
                ->map(fn (Event $event) => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'starts_at' => $event->starts_at?->format('Y-m-d'),
                    'ends_at' => $event->ends_at?->format('Y-m-d'),
                ]),
        ];
    }
}
