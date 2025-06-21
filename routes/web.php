<?php

use App\Http\Controllers\TermController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//VIEW ROUTES (GUEST USERS)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/academic-calendar.php';
require __DIR__.'/groups.php';
require __DIR__.'/lecturer-schedules.php';
require __DIR__.'/lecturer-subjects.php';
require __DIR__.'/lecturers.php';
require __DIR__.'/program-subjects.php';
require __DIR__.'/programs.php';
require __DIR__.'/rooms.php';
require __DIR__.'/subjects.php';
require __DIR__.'/terms.php';
