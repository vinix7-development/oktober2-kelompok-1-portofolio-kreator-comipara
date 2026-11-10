<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function store(Request $request, string $username): JsonResponse
    {
        $target = User::where('username', $username)->firstOrFail();
        $me = $request->user();

        if ($target->id === $me->id) {
            return response()->json(['message' => 'Kamu tidak bisa mengikuti dirimu sendiri.'], 422);
        }

        $exists = $me->following()->where('following_id', $target->id)->first();

        if (! $exists) {
            $me->following()->create(['following_id' => $target->id]);
            Notification::create([
                'user_id' => $target->id,
                'actor_id' => $me->id,
                'type' => 'follow',
                'data' => ['message' => $me->name.' mulai mengikuti kamu.'],
            ]);
        }

        return response()->json([
            'following' => true,
            'followers' => $target->followers()->count(),
        ]);
    }

    public function destroy(Request $request, string $username): JsonResponse
    {
        $target = User::where('username', $username)->firstOrFail();
        $me = $request->user();

        $me->following()->where('following_id', $target->id)->delete();

        return response()->json([
            'following' => false,
            'followers' => $target->followers()->count(),
        ]);
    }
}
