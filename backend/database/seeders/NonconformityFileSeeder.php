<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NonconformityFileSeeder extends Seeder
{
    public function run(): void
    {
        $nonconfIds = DB::table('nonconformities')->pluck('id')->toArray();

        if (empty($nonconfIds)) {
            return;
        }

        $now   = now();
        $data  = [];
        $exts  = ['jpg', 'png', 'pdf'];

        foreach ($nonconfIds as $id) {
            for ($i = 1; $i <= 10; $i++) {

                $ext = $exts[array_rand($exts)];

                $data[] = [
                    'nonconformity_id' => $id,
                    'path'             => "mv_files/seed_{$id}_{$i}.{$ext}",
                    'original_name'    => "seed_file_{$id}_{$i}.{$ext}",
                    'mime_type'        => $ext === 'pdf'
                        ? 'application/pdf'
                        : 'image/' . ($ext === 'jpg' ? 'jpeg' : 'png'),
                    'size'             => rand(50_000, 2_000_000),
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ];
            }
        }

        DB::table('nonconformity_files')->insert($data);
    }
}
