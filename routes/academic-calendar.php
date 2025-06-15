<?php

use App\Http\Controllers\AcademicCalendarController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(AcademicCalendarController::class)->group(function () {
        Route::get('calendar', 'index')->name('calendar');
        Route::post('calendar', 'store');
        Route::put('calendar/{academicCalendar}', 'update');
        Route::delete('calendar/{academicCalendar}', 'destroy');
    });
});

