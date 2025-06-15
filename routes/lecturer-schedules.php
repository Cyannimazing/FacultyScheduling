<?php

use App\Http\Controllers\LecturerScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(LecturerScheduleController::class)->group(function () {
        Route::get('faculty-schedule', 'index')->name('faculty-schedule');
        Route::post('faculty-schedule', 'store');
        Route::put('faculty-schedule/{lecturerSchedule}', 'update');
        Route::delete('faculty-schedule/{lecturerSchedule}', 'destroy');
    });
});

