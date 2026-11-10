<?php

namespace App\Support;

use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Photo;
use App\Models\User;

class Presenter
{
    public static function userSummary(?User $user): ?array
    {
        if (! $user) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'avatar_url' => $user->avatar_url,
        ];
    }

    public static function user(User $user, ?User $viewer = null): array
    {
        $profile = $user->creatorProfile;
        $counts = $user->relationLoaded('counts') ? $user->counts : null;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'bio' => $user->bio,
            'avatar_url' => $user->avatar_url,
            'is_admin' => (bool) $user->is_admin,
            'is_creator' => (bool) $user->is_creator,
            'creator_profile' => $profile ? [
                'categories' => $profile->categories ?? [],
                'city' => $profile->city,
                'commission_open' => (bool) $profile->commission_open,
                'description' => $profile->description,
                'links' => $profile->links ?? [],
            ] : null,
            'stats' => [
                'photos' => $counts['photos_count'] ?? $user->photos()->count(),
                'followers' => $counts['followers_count'] ?? $user->followers()->count(),
                'following' => $counts['following_count'] ?? $user->following()->count(),
            ],
            'attendance' => self::attendanceSummary($user),
            'is_following' => $viewer ? $viewer->following()->where('following_id', $user->id)->exists() : false,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }

    public static function attendanceSummary(User $user): ?array
    {
        $attendances = $user->relationLoaded('approvedAttendances')
            ? $user->approvedAttendances->filter(fn ($item) => $item->event)
            : $user->approvedAttendances()->with('event')->get();

        if ($attendances->isEmpty()) {
            return null;
        }

        // Utamakan event yang belum berakhir; kalau tidak ada, pakai yang terbaru.
        $upcoming = $attendances
            ->filter(fn ($item) => ! $item->event->ends_at?->isPast())
            ->sortByDesc(fn ($item) => $item->event->starts_at)
            ->first();

        $attendance = $upcoming ?: $attendances->sortByDesc('id')->first();

        if (! $attendance || ! $attendance->event) {
            return null;
        }

        return [
            'event_id' => $attendance->event_id,
            'event_title' => $attendance->event->title,
            'event_slug' => $attendance->event->slug,
            'booth_number' => $attendance->booth_number,
            'label' => 'Hadir di '.$attendance->event->title.' · Booth '.$attendance->booth_number,
        ];
    }

    public static function photo(Photo $photo, ?User $viewer = null): array
    {
        return [
            'id' => $photo->id,
            'url' => $photo->url,
            'caption' => $photo->caption,
            'hashtags' => $photo->hashtags ?? [],
            'like_count' => (int) $photo->like_count,
            'comment_count' => (int) $photo->comment_count,
            'liked' => $viewer ? $photo->likes()->where('user_id', $viewer->id)->exists() : false,
            'created_at' => $photo->created_at?->toIso8601String(),
            'user' => self::userSummary($photo->user),
            'album' => $photo->album ? [
                'id' => $photo->album->id,
                'title' => $photo->album->title,
            ] : null,
        ];
    }

    public static function comment($comment): array
    {
        return [
            'id' => $comment->id,
            'body' => $comment->body,
            'created_at' => $comment->created_at?->toIso8601String(),
            'user' => self::userSummary($comment->user),
            'can_delete' => false,
        ];
    }

    public static function event(Event $event, ?User $viewer = null): array
    {
        $attendance = null;
        if ($viewer) {
            $attendance = $event->attendances()->where('user_id', $viewer->id)->first();
        }

        return [
            'id' => $event->id,
            'title' => $event->title,
            'slug' => $event->slug,
            'description' => $event->description,
            'location' => $event->location,
            'starts_at' => $event->starts_at?->format('Y-m-d'),
            'ends_at' => $event->ends_at?->format('Y-m-d'),
            'attendee_count' => $event->relationLoaded('approvedAttendances')
                ? $event->approvedAttendances->count()
                : $event->approvedAttendances()->count(),
            'is_past' => $event->ends_at?->isPast() ?? false,
            'my_attendance' => $attendance ? [
                'id' => $attendance->id,
                'booth_number' => $attendance->booth_number,
                'status' => $attendance->status,
            ] : null,
        ];
    }

    public static function attendance(EventAttendance $attendance): array
    {
        return [
            'id' => $attendance->id,
            'booth_number' => $attendance->booth_number,
            'status' => $attendance->status,
            'reviewed_at' => $attendance->reviewed_at?->toIso8601String(),
            'created_at' => $attendance->created_at?->toIso8601String(),
            'user' => self::userSummary($attendance->user),
            'event' => $attendance->event ? [
                'id' => $attendance->event->id,
                'title' => $attendance->event->title,
                'slug' => $attendance->event->slug,
                'starts_at' => $attendance->event->starts_at?->format('Y-m-d'),
                'ends_at' => $attendance->event->ends_at?->format('Y-m-d'),
                'location' => $attendance->event->location,
            ] : null,
        ];
    }

    public static function notification($notification): array
    {
        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'read' => $notification->read_at !== null,
            'created_at' => $notification->created_at?->toIso8601String(),
            'actor' => self::userSummary($notification->actor),
            'photo' => $notification->photo ? [
                'id' => $notification->photo->id,
                'url' => $notification->photo->url,
            ] : null,
            'message' => $notification->data['message'] ?? null,
        ];
    }
}
