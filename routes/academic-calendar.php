<?php

use App\Http\Controllers\AcademicCalendarController;
use Illuminate\Support\Facades\Route;

// Academic Calendar Routes
Route::middleware(['auth', 'verified'])->prefix('academic-calendar')->name('academic-calendar.')->group(function () {
    Route::get('/', [AcademicCalendarController::class, 'index'])->name('index');
    Route::post('/', [AcademicCalendarController::class, 'store'])->name('store');
    Route::get('/{academicCalendar}', [AcademicCalendarController::class, 'show'])->name('show');
    Route::put('/{academicCalendar}', [AcademicCalendarController::class, 'update'])->name('update');
    Route::delete('/{academicCalendar}', [AcademicCalendarController::class, 'destroy'])->name('destroy');
});

