<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\NonconformityType;
use App\Enums\NonconformityUnit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Nonconformity extends Model
{
    use HasFactory;

    protected $fillable = [
        'barcode',
        'type_code',
        'quantity',
        'unit',
        'comment',
        'created_by',
        'disabled',
    ];

    protected $casts = [
        'disabled' => 'boolean',
        'type_code' => NonconformityType::class,
        'unit' => NonconformityUnit::class,
    ];

    public function files(): HasMany
    {
        return $this->hasMany(NonconformityFile::class);
    }

    protected static function booted(): void
    {
        static::deleting(function (Nonconformity $nonconformity) {
            $nonconformity->loadMissing('files');

            foreach ($nonconformity->files as $file) {
                if ($file->path) {
                    Storage::disk('public')->delete($file->path);
                }
            }
        });
    }
}
