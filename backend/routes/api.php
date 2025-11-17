<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NonconformityController;
use App\Http\Controllers\Api\NonconformityFileController;

Route::prefix('nonconformity')->group(function () {

    Route::get('/', [NonconformityController::class, 'index']);
    Route::post('/', [NonconformityController::class, 'store']);
    Route::get('/{id}', [NonconformityController::class, 'show']);
    Route::put('/{id}', [NonconformityController::class, 'update']);
    Route::delete('/{id}', [NonconformityController::class, 'destroy']);

    Route::post('/{id}/files', [NonconformityFileController::class, 'store']);
});
