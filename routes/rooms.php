<?php

use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

// Room Routes
Route::middleware(['auth'])->prefix('rooms')->name('rooms.')->group(function () {
    Route::post('/', [RoomController::class, 'store'])->name('store');
    Route::get('/', [RoomController::class, 'index'])->name('index');
    Route::get('/{room}', [RoomController::class, 'show'])->name('show');
    Route::put('/{room}', [RoomController::class, 'update'])->name('update');
    Route::delete('/{room}', [RoomController::class, 'destroy'])->name('destroy');
});

