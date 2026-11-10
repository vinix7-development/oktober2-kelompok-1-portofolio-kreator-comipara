<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'categories',
        'city',
        'commission_open',
        'description',
        'links',
    ];

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'links' => 'array',
            'commission_open' => 'boolean',
        ];
    }

    public const CATEGORIES = ['Illustrator', 'Cosplayer', 'Fotografer', 'Crafter', 'Lainnya'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
