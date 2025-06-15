<?php

use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(RoomController::class)->group(function () {
        Route::get('room', 'index')->name('room');
        Route::post('room', 'store');
        Route::put('room/{room}', 'update');
        Route::delete('room/{room}', 'destroy');
    });
});

