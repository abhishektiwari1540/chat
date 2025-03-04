<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomepagesController;
use Inertia\Inertia;
use App\Http\Middleware\EnsureSessionStored;
use App\Http\Controllers\VideoController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/videos/{user_id}', [VideoController::class, 'getUserVideos']);
Route::middleware([EnsureSessionStored::class])->group(function () {
    Route::get('/home', [HomepagesController::class, 'index'])->name('home.index');
});

// Route::get('/home', function () {
//     return Inertia::render('Example', [
//         'message' => 'Hello from Laravel!'
//     ]);
// });
