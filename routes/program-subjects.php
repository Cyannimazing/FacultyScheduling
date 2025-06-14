<?php

use App\Http\Controllers\ProgramSubjectController;
use Illuminate\Support\Facades\Route;

// Program Subject Routes
Route::middleware(['auth', 'verified'])->prefix('program-subjects')->name('program-subjects.')->group(function () {
    Route::get('/', [ProgramSubjectController::class, 'index'])->name('index');
    Route::post('/', [ProgramSubjectController::class, 'store'])->name('store');
    Route::get('/{programSubject}', [ProgramSubjectController::class, 'show'])->name('show');
    Route::put('/{programSubject}', [ProgramSubjectController::class, 'update'])->name('update');
    Route::delete('/{programSubject}', [ProgramSubjectController::class, 'destroy'])->name('destroy');
});

