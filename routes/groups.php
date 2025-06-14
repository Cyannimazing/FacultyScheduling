<?php

use App\Http\Controllers\GroupController;
use Illuminate\Support\Facades\Route;

// Group Routes
Route::middleware(['auth', 'verified'])->prefix('groups')->name('groups.')->group(function () {
    Route::get('/', [GroupController::class, 'index'])->name('index');
    Route::post('/', [GroupController::class, 'store'])->name('store');
    Route::get('/{group}', [GroupController::class, 'show'])->name('show');
    Route::put('/{group}', [GroupController::class, 'update'])->name('update');
    Route::delete('/{group}', [GroupController::class, 'destroy'])->name('destroy');
});

