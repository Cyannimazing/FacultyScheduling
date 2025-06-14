<?php

use App\Http\Controllers\LecturerSubjectController;
use Illuminate\Support\Facades\Route;

// Lecturer Subject Routes
Route::middleware(['auth', 'verified'])->prefix('lecturer-subjects')->name('lecturer-subjects.')->group(function () {
    Route::get('/', [LecturerSubjectController::class, 'index'])->name('index');
    Route::post('/', [LecturerSubjectController::class, 'store'])->name('store');
    Route::get('/{lecturerSubject}', [LecturerSubjectController::class, 'show'])->name('show');
    Route::put('/{lecturerSubject}', [LecturerSubjectController::class, 'update'])->name('update');
    Route::delete('/{lecturerSubject}', [LecturerSubjectController::class, 'destroy'])->name('destroy');
});

