<?php

use App\Http\Controllers\TimeSlotController;
use Illuminate\Support\Facades\Route;

// Time Slot Routes
Route::middleware(['auth', 'verified'])->prefix('time-slots')->name('time-slots.')->group(function () {
    Route::get('/', [TimeSlotController::class, 'index'])->name('index');
    Route::post('/', [TimeSlotController::class, 'store'])->name('store');
    Route::get('/{timeSlot}', [TimeSlotController::class, 'show'])->name('show');
    Route::put('/{timeSlot}', [TimeSlotController::class, 'update'])->name('update');
    Route::delete('/{timeSlot}', [TimeSlotController::class, 'destroy'])->name('destroy');
});

