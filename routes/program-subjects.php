<?php

use App\Http\Controllers\ProgramSubjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(ProgramSubjectController::class)->group(function () {
        Route::get('course-assignment', 'index')->name('course-assignment');
        Route::post('course-assignment', 'store');
        Route::put('course-assignment/{id}', 'update');
        Route::delete('course-assignment/{id}', 'destroy');
    });
});

