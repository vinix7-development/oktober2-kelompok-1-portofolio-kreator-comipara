<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Notification;
use App\Models\Photo;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Photo $photo): JsonResponse
    {
        $viewer = $request->user();

        return response()->json([
            'data' => $photo->comments()->with('user')->latest()->get()->map(fn ($comment) => [
                ...Presenter::comment($comment),
                'can_delete' => $viewer ? ($viewer->id === $comment->user_id || $viewer->id === $photo->user_id || $viewer->is_admin) : false,
            ]),
        ]);
    }

    public function store(Request $request, Photo $photo): JsonResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'min:1', 'max:600'],
        ], [
            'body.required' => 'Tulis komentar terlebih dahulu.',
            'body.max' => 'Komentar maksimal 600 karakter.',
        ]);

        $comment = $photo->comments()->create([
            'user_id' => $request->user()->id,
            'body' => trim($data['body']),
        ]);

        $photo->increment('comment_count');

        if ($photo->user_id !== $request->user()->id) {
            Notification::create([
                'user_id' => $photo->user_id,
                'actor_id' => $request->user()->id,
                'type' => 'comment',
                'photo_id' => $photo->id,
                'comment_id' => $comment->id,
                'data' => [
                    'message' => $request->user()->name.' mengomentari karyamu: "'.mb_strimwidth(trim($data['body']), 0, 60, '…').'"',
                ],
            ]);
        }

        return response()->json([
            'message' => 'Komentar terkirim.',
            'comment' => [
                ...Presenter::comment($comment->load('user')),
                'can_delete' => true,
            ],
            'comment_count' => $photo->fresh()->comment_count,
        ], 201);
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id && $comment->photo->user_id !== $user->id && ! $user->is_admin) {
            return response()->json(['message' => 'Kamu tidak boleh menghapus komentar ini.'], 403);
        }

        $photo = $comment->photo;
        $comment->delete();
        $photo->decrement('comment_count');

        return response()->json([
            'message' => 'Komentar dihapus.',
            'comment_count' => max(0, (int) $photo->fresh()->comment_count),
        ]);
    }
}
