<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nonconformity;
use App\Models\NonconformityFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NonconformityFileController extends Controller
{
    public function store(Request $request, $id): JsonResponse
    {
        $nonconformity = Nonconformity::findOrFail($id);

        $request->validate([
            'upload' => 'required',
            'upload.*' => 'file|max:10240|mimes:jpg,jpeg,png,pdf',
        ]);

        $saved = [];

        $files = $request->file('upload');

        if ($files) {
            if (!is_array($files)) {
                $files = [$files];
            }

            foreach ($files as $uploadedFile) {
                $path = $uploadedFile->store('nonconformity_files', 'public');

                $file = NonconformityFile::create([
                    'nonconformity_id' => $nonconformity->id,
                    'path'             => $path,
                    'original_name'    => $uploadedFile->getClientOriginalName(),
                    'mime_type'        => $uploadedFile->getClientMimeType(),
                    'size'             => $uploadedFile->getSize(),
                ]);

                $saved[] = $file;
            }
        }

        return response()->json($saved, 201);
    }
}
