<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $events = Event::with(['approvedAttendances.user.creatorProfile'])
            ->orderByDesc('starts_at')
            ->get();

        return response()->json([
            'data' => $events->map(fn (Event $event) => [
                ...Presenter::event($event, $request->user()),
                'attendees' => $event->approvedAttendances->take(8)->map(fn ($attendance) => [
                    ...Presenter::userSummary($attendance->user),
                    'booth_number' => $attendance->booth_number,
                ]),
            ]),
        ]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        $event->load(['approvedAttendances.user.creatorProfile']);

        return response()->json([
            'event' => Presenter::event($event, $request->user()),
            'attendees' => $event->approvedAttendances
                ->sortBy('booth_number')
                ->map(fn ($attendance) => [
                    'id' => $attendance->id,
                    'booth_number' => $attendance->booth_number,
                    'user' => Presenter::user($attendance->user, $request->user()),
                ])
                ->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatePayload($request);
        $data['slug'] = $this->uniqueSlug($data['title']);

        $event = Event::create($data);

        return response()->json([
            'message' => 'Event berhasil dibuat.',
            'event' => Presenter::event($event),
        ], 201);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $data = $this->validatePayload($request, $event);

        if ($data['title'] !== $event->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $event->id);
        }

        $event->update($data);

        return response()->json([
            'message' => 'Event diperbarui.',
            'event' => Presenter::event($event->fresh()),
        ]);
    }

    public function destroy(Event $event): JsonResponse
    {
        $event->delete();

        return response()->json(['message' => 'Event dihapus.']);
    }

    private function validatePayload(Request $request, ?Event $event = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'location' => ['required', 'string', 'min:3', 'max:160'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after_or_equal:starts_at'],
        ], [
            'title.required' => 'Nama event wajib diisi.',
            'location.required' => 'Lokasi wajib diisi.',
            'starts_at.required' => 'Tanggal mulai wajib diisi.',
            'ends_at.required' => 'Tanggal selesai wajib diisi.',
            'ends_at.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
        ]);

        return $data;
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'event';
        $slug = $base;
        $i = 2;

        while (Event::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
