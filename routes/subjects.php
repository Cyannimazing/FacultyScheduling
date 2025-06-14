<?php

use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

// Subject Routes
Route::middleware(['auth', 'verified'])->prefix('subjects')->name('subjects.')->group(function () {
    Route::get('/', [SubjectController::class, 'index'])->name('index');
    Route::post('/', [SubjectController::class, 'store'])->name('store');
    Route::get('/{subject}', [SubjectController::class, 'show'])->name('show');
    Route::put('/{subject}', [SubjectController::class, 'update'])->name('update');
    Route::delete('/{subject}', [SubjectController::class, 'destroy'])->name('destroy');
});

