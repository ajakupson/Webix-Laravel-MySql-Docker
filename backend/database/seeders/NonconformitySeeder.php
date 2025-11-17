<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\NonconformityType;
use App\Enums\NonconformityUnit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NonconformitySeeder extends Seeder
{
    public function run(): void
    {
        $types = NonconformityType::values();
        $units = NonconformityUnit::values();

        $now = now();
        $data = [];

        for ($i = 1; $i <= 50; $i++) {
            $data[] = [
                'barcode'    => sprintf('TEST-%05d', $i),
                'type_code'  => $types[($i - 1) % count($types)],
                'quantity'   => rand(1, 100),
                'unit'       => $units[($i - 1) % count($units)],
                'comment'    => 'Test mittevastavus #' . $i,
                'created_by' => 'seeder',
                'disabled'   => ($i % 10 === 0),
                'created_at' => $now->copy()->subDays(50 - $i),
                'updated_at' => $now->copy()->subDays(50 - $i),
            ];
        }

        DB::table('nonconformities')->insert($data);
    }
}
