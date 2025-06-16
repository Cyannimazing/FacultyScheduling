<?php

use App\Http\Controllers\ProgramController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(ProgramController::class)->group(function () {
        Route::get('program', 'index')->name('program');
        Route::post('program', 'store');
        Route::put('program/{id}', 'update');
        Route::delete('program/{id}', 'destroy');
    });
});

