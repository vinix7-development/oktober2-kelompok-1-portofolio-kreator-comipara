<?php

namespace App\Http\Controllers;

use App\Models\EventAttendance;
use App\Models\Notification;
use App\Models\User;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function attendances(Request $request): JsonResponse
    {
        $query = EventAttendance::with(['user', 'event'])->orderByDesc('id');

        $status = $request->query('status');
        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if ($eventId = $request->query('event')) {
            $query->where('event_id', $eventId);
        }

        $attendances = $query->get();

        return response()->json([
            'data' => $attendances->map(fn (EventAttendance $attendance) => Presenter::attendance($attendance)),
            'counts' => [
                'pending' => EventAttendance::where('status', 'pending')->count(),
                'approved' => EventAttendance::where('status', 'approved')->count(),
                'rejected' => EventAttendance::where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function review(Request $request, EventAttendance $attendance): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected,pending'],
        ], [
            'status.in' => 'Status tidak valid.',
        ]);

        $attendance->update([
            'status' => $data['status'],
            'reviewed_at' => now(),
        ]);

        if ($data['status'] !== 'pending') {
            $approved = $data['status'] === 'approved';
            Notification::create([
                'user_id' => $attendance->user_id,
                'actor_id' => $request->user()->id,
                'type' => $approved ? 'attendance_approved' : 'attendance_rejected',
                'data' => [
                    'message' => $approved
                        ? 'Kehadiranmu di '.$attendance->event->title.' disetujui · Booth '.$attendance->booth_number.'.'
                        : 'Pendaftaran kehadiranmu di '.$attendance->event->title.' belum bisa disetujui.',
                ],
            ]);
        }

        return response()->json([
            'message' => $data['status'] === 'approved'
                ? 'Kehadiran disetujui.'
                : ($data['status'] === 'rejected' ? 'Kehadiran ditolak.' : 'Status dikembalikan ke menunggu.'),
            'attendance' => Presenter::attendance($attendance->fresh(['user', 'event'])),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::query()->with('creatorProfile')->withCount(['photos', 'followers']);

        if ($search = trim((string) $request->query('q'))) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('username', 'like', "%{$search}%"));
        }

        return response()->json([
            'data' => $query->orderBy('name')->paginate(20)->through(fn (User $user) => Presenter::user($user)),
        ]);
    }

    public function dashboard(): JsonResponse
    {
        return response()->json([
            'counts' => [
                'creators' => User::where('is_creator', true)->count(),
                'photos' => \App\Models\Photo::count(),
                'events' => \App\Models\Event::count(),
                'pending_attendances' => EventAttendance::where('status', 'pending')->count(),
                'comments' => \App\Models\Comment::count(),
            ],
        ]);
    }
}
