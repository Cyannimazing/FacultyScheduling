<?php

use App\Http\Controllers\LecturerSubjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(LecturerSubjectController::class)->group(function () {
        Route::get('subject-allocation', 'index')->name('subject-allocation');
        Route::post('subject-allocation', 'store');
        Route::put('subject-allocation/{lecturerSubject}', 'update');
        Route::delete('subject-allocation/{lecturerSubject}', 'destroy');
    });
});

