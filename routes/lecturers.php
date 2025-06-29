<?php

use App\Http\Controllers\LecturerController;
use App\Http\Controllers\LecturerLoadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(LecturerController::class)->group(function () {
        Route::get('lecturer', 'index')->name('lecturer');
        Route::post('lecturer', 'store');
        Route::put('lecturer/{lecturer}', 'update');
        Route::delete('lecturer/{lecturer}', 'destroy');
    });
    
    // Lecturer Load routes
    Route::controller(LecturerLoadController::class)->group(function () {
        Route::get('lecturer-load/current', 'current')->name('lecturer-load.current');
        Route::post('lecturer-load', 'store')->name('lecturer-load.store');
        Route::put('lecturer-load/{lecturerLoad}', 'update')->name('lecturer-load.update');
        Route::delete('lecturer-load/{lecturerLoad}', 'destroy')->name('lecturer-load.destroy');
    });
});

