<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\NonconformityType;
use App\Enums\NonconformityUnit;
use App\Http\Controllers\Controller;
use App\Models\Nonconformity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class NonconformityController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Nonconformity::with('files')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($items);
    }

    public function show(int $id): JsonResponse
    {
        $item = Nonconformity::with('files')->findOrFail($id);

        return response()->json($item);
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            $this->rules()
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $item = Nonconformity::create($data);

        return response()->json(
            $item->load('files'),
            201
        );
    }

    /**
     * @throws ValidationException
     */
    public function update(Request $request, $id): JsonResponse
    {
        $item = Nonconformity::findOrFail($id);

        $validator = Validator::make(
            $request->all(),
            $this->rules(true)
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $item->update($data);

        return response()->json($item->load('files'));
    }

    public function destroy($id): JsonResponse
    {
        $item = Nonconformity::with('files')->findOrFail($id);

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }

    protected function rules(): array
    {
        return [
            'barcode'    => ['required', 'string', 'max:255'],
            'type_code' => ['required', 'string', Rule::in(NonconformityType::values())],
            'quantity'   => ['required', 'integer', 'min:1'],
            'unit'       => ['required', 'string', Rule::in(NonconformityUnit::values()), 'max:10'],
            'comment'    => ['nullable', 'string', 'max:500'],
            'created_by' => ['required', 'string', 'max:255'],
            'disabled'   => ['boolean'],
        ];
    }
}
