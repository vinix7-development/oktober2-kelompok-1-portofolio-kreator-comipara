<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventAttendance;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $attendances = $request->user()->attendances()
            ->with('event')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => $attendances->map(fn (EventAttendance $attendance) => Presenter::attendance($attendance)),
        ]);
    }

    public function store(Request $request, Event $event): JsonResponse
    {
        $user = $request->user();

        if (! $user->is_creator || ! $user->creatorProfile) {
            return response()->json([
                'message' => 'Lengkapi profil kreator terlebih dahulu sebelum mendaftar ke event.',
            ], 422);
        }

        if ($event->ends_at?->isPast()) {
            return response()->json(['message' => 'Event ini sudah berakhir.'], 422);
        }

        $data = $request->validate([
            'booth_number' => ['required', 'string', 'min:1', 'max:12', 'regex:/^[A-Za-z0-9][A-Za-z0-9\- ]*$/'],
        ], [
            'booth_number.required' => 'Nomor booth wajib diisi.',
            'booth_number.max' => 'Nomor booth maksimal 12 karakter.',
            'booth_number.regex' => 'Nomor booth hanya boleh huruf, angka, spasi, dan tanda hubung.',
        ]);

        $booth = strtoupper(trim($data['booth_number']));
        $taken = $event->attendances()
            ->where('status', 'approved')
            ->where('booth_number', $booth)
            ->where('user_id', '!=', $user->id)
            ->exists();

        if ($taken) {
            return response()->json([
                'message' => 'Nomor booth '.$booth.' sudah dipakai kreator lain. Pilih nomor lain atau hubungi admin.',
            ], 422);
        }

        $attendance = EventAttendance::updateOrCreate(
            ['event_id' => $event->id, 'user_id' => $user->id],
            ['booth_number' => $booth, 'status' => 'pending', 'reviewed_at' => null]
        );

        return response()->json([
            'message' => 'Pendaftaran kehadiran terkirim. Menunggu persetujuan admin.',
            'attendance' => Presenter::attendance($attendance->load(['event', 'user'])),
        ], 201);
    }

    public function destroy(Request $request, Event $event): JsonResponse
    {
        $request->user()->attendances()->where('event_id', $event->id)->delete();

        return response()->json(['message' => 'Pendaftaran kehadiran dibatalkan.']);
    }
}
