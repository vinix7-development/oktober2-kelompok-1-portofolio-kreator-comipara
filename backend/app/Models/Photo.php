<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    protected $fillable = [
        'user_id',
        'album_id',
        'path',
        'caption',
        'hashtags',
        'like_count',
        'comment_count',
    ];

    protected function casts(): array
    {
        return [
            'hashtags' => 'array',
            'like_count' => 'integer',
            'comment_count' => 'integer',
        ];
    }

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        if (str_starts_with($this->path, 'http')) {
            return $this->path;
        }

        return url('uploads/'.$this->path);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function deleteFiles(): void
    {
        if (! str_starts_with($this->path, 'http') && $this->path) {
            Storage::disk('uploads')->delete($this->path);
        }
    }
}
