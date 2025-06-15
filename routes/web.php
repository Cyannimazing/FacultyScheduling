<?php

use App\Http\Controllers\TermController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//VIEW ROUTES (GUEST USERS)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//VIEW ROUTES (AUTHENTICATED USERS)
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('faculty-schedule', function () {
        return Inertia::render('application/faculty-schedule');
    })->name('faculty-schedule');

    Route::get('subject-allocation', function () {
        return Inertia::render('application/subject-allocation');
    })->name('subject-allocation');

    Route::get('course-assignment', function () {
        return Inertia::render('application/course-assignment');
    })->name('course-assignment');

    Route::get('calendar', function () {
        return Inertia::render('application/calendar');
    })->name('calendar');

    Route::get('program', function () {
        return Inertia::render('application/program');
    })->name('program');

    Route::get('lecturer', function () {
        return Inertia::render('application/lecturer');
    })->name('lecturer');

    Route::get('class', function () {
        return Inertia::render('application/class');
    })->name('class');

    Route::get('subject', function () {
        return Inertia::render('application/subject');
    })->name('subject');

    Route::get('room', function () {
        return Inertia::render('application/room');
    })->name('room');

    //TERM ROUTES
    Route::controller(TermController::class)->group(function () {
        Route::get('term', 'index')->name('term');
        Route::post('term', 'store');
        Route::put('term/{term}', 'update');
        Route::delete('term/{term}', 'destroy');
    });
    
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
