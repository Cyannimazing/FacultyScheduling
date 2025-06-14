<?php

use App\Http\Controllers\TermController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('terms')->name('terms.')->group(function () {
    Route::get('/', [TermController::class, 'index'])->name('index');
    Route::post('/', [TermController::class, 'store'])->name('store');
    Route::get('/{term}', [TermController::class, 'show'])->name('show');
    Route::put('/{term}', [TermController::class, 'update'])->name('update');
    Route::delete('/{term}', [TermController::class, 'destroy'])->name('destroy');
});

