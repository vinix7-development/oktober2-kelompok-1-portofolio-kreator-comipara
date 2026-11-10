<?php

namespace App\Http\Controllers;

use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->notifications()->with(['actor', 'photo']);

        if ($request->boolean('unread')) {
            $query->whereNull('read_at');
        }

        return response()->json([
            'data' => $query->limit(50)->get()->map(fn ($notification) => Presenter::notification($notification)),
            'unread' => $request->user()->notifications()->whereNull('read_at')->count(),
        ]);
    }

    public function readAll(Request $request): JsonResponse
    {
        $request->user()->notifications()->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['message' => 'Semua notifikasi ditandai sudah dibaca.', 'unread' => 0]);
    }
}
