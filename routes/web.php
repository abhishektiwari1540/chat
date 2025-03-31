<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomepagesController;
use Inertia\Inertia;
use App\Http\Middleware\EnsureSessionStored;
use App\Http\Controllers\VideoController;
use App\Events\MessageSent;
use Illuminate\Http\Request;


Route::get('/videos/{user_id}', [VideoController::class, 'getUserVideos']);
Route::get('/chat-room-join', [HomepagesController::class, 'chatingRoomJoin'])->name('room.join');
Route::post('/chating-room-details', [HomepagesController::class, 'chatingRoomDetails'])->name('home.chat.room.details');
Route::middleware([EnsureSessionStored::class])->group(function () {
    Route::get('/home', [HomepagesController::class, 'index'])->name('home.index');
    Route::get('/chating-room', [HomepagesController::class, 'chatingRoom'])->name('home.chat.room');
    Route::post('/chating-store', [HomepagesController::class, 'chatStore'])->name('home.chat.store');

});

