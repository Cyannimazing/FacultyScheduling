<?php

use App\Http\Controllers\LecturerScheduleController;
use Illuminate\Support\Facades\Route;

// Lecturer Schedule Routes
Route::middleware(['auth', 'verified'])->prefix('lecturer-schedules')->name('lecturer-schedules.')->group(function () {
    Route::get('/', [LecturerScheduleController::class, 'index'])->name('index');
    Route::post('/', [LecturerScheduleController::class, 'store'])->name('store');
    Route::get('/{lecturerSchedule}', [LecturerScheduleController::class, 'show'])->name('show');
    Route::put('/{lecturerSchedule}', [LecturerScheduleController::class, 'update'])->name('update');
    Route::delete('/{lecturerSchedule}', [LecturerScheduleController::class, 'destroy'])->name('destroy');
});

