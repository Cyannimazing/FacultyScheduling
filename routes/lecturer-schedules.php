<?php

use App\Http\Controllers\LecturerScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(LecturerScheduleController::class)->group(function () {
        Route::get('faculty-schedule', 'index')->name('faculty-schedule');
        Route::post('faculty-schedule', 'store');
        Route::put('faculty-schedule/{lecturerSchedule}', 'update');
        Route::delete('faculty-schedule/{lecturerSchedule}', 'destroy');
        Route::get('api/subject-by-lecturer-schoolyear/{sy_term_id}/{lecturer_id}', 'getSubjectsByLecturerAndSchoolYear');
        Route::get('api/classes-by-prog-code/{prog_code}', 'getClassByProgram');
        Route::get('api/time-slot-by-day/{day}', 'getTimeSlotByDay');

        Route::get('class-schedule', 'getGroupSchedule');
        Route::get('room-schedule', 'getRoomSchedule');
    });
});

