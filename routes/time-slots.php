<?php

use App\Http\Controllers\TimeSlotController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(TimeSlotController::class)->group(function () {
        Route::get('time-slot', 'index')->name('time-slot');
        Route::post('time-slot', 'store');
        Route::put('time-slot/{timeSlot}', 'update');
        Route::delete('time-slot/{timeSlot}', 'destroy');
    });
});

