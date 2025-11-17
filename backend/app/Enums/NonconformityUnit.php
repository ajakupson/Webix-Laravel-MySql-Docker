<?php

declare(strict_types=1);

namespace App\Enums;

enum NonconformityUnit: string
{
    case THV  = 'thv';
    case KERE = 'kere';
    case TK   = 'tk';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
