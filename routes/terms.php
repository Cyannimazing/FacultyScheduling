<?php

use App\Http\Controllers\TermController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(TermController::class)->group(function () {
        Route::get('term', 'index')->name('term');
        Route::post('term', 'store');
        Route::put('term/{term}', 'update');
        Route::delete('term/{term}', 'destroy');
    });
});

