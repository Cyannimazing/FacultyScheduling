<?php

use App\Http\Controllers\LecturerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(LecturerController::class)->group(function () {
        Route::get('lecturer', 'index')->name('lecturer');
        Route::post('lecturer', 'store');
        Route::put('lecturer/{lecturer}', 'update');
        Route::delete('lecturer/{lecturer}', 'destroy');
    });
});

