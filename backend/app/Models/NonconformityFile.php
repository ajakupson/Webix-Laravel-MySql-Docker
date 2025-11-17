<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NonconformityFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'nonconformity_id',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $appends = ['url'];

    public function nonconformity(): BelongsTo
    {
        return $this->belongsTo(Nonconformity::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    protected static function booted(): void
    {
        static::deleted(function (NonconformityFile $file) {
            if ($file->path) {
                Storage::disk('public')->delete($file->path);
            }
        });
    }
}
