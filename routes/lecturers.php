<?php

use App\Http\Controllers\LecturerController;
use Illuminate\Support\Facades\Route;

// Lecturer Routes
Route::middleware(['auth', 'verified'])->prefix('lecturers')->name('lecturers.')->group(function () {
    Route::get('/', [LecturerController::class, 'index'])->name('index');
    Route::post('/', [LecturerController::class, 'store'])->name('store');
    Route::get('/{lecturer}', [LecturerController::class, 'show'])->name('show');
    Route::put('/{lecturer}', [LecturerController::class, 'update'])->name('update');
    Route::delete('/{lecturer}', [LecturerController::class, 'destroy'])->name('destroy');
});

