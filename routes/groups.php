<?php

use App\Http\Controllers\GroupController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(GroupController::class)->group(function () {
        Route::get('class', 'index')->name('class');
        Route::post('class', 'store');
        Route::put('class/{group}', 'update');
        Route::delete('class/{group}', 'destroy');
    });
});

