<?php

use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(SubjectController::class)->group(function () {
        Route::get('subject', 'index')->name('subject');
        Route::post('subject', 'store');
        Route::put('subject/{subject}', 'update');
        Route::delete('subject/{subject}', 'destroy');
    });
});

