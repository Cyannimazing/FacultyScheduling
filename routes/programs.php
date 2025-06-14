<?php

use App\Http\Controllers\ProgramController;
use Illuminate\Support\Facades\Route;

// Program Routes
Route::middleware(['auth', 'verified'])->prefix('programs')->name('programs.')->group(function () {
    Route::get('/', [ProgramController::class, 'index'])->name('index');
    Route::post('/', [ProgramController::class, 'store'])->name('store');
    Route::get('/{program}', [ProgramController::class, 'show'])->name('show');
    Route::put('/{program}', [ProgramController::class, 'update'])->name('update');
    Route::delete('/{program}', [ProgramController::class, 'destroy'])->name('destroy');
});

