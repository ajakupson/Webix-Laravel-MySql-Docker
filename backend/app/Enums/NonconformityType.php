<?php

declare(strict_types=1);

namespace App\Enums;

enum NonconformityType: string
{
    case RUST_STAIN        = 'rust_stain';
    case STAIN_PAINTED     = 'stain_painted';
    case TOO_LARGE_PACK    = 'too_large_pack';
    case PRINT_STRIPES     = 'print_stripes_dots';
    case TONE_DIFF         = 'tone_diff';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
