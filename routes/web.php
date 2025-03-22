<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomepagesController;
use Inertia\Inertia;
use App\Http\Middleware\EnsureSessionStored;
use App\Http\Controllers\VideoController;
use App\Events\MessageSent;
use Illuminate\Http\Request;

Route::post('/send-message', function (Request $request) {
    broadcast(new MessageSent($request->message))->toOthers();
    return response()->json(['status' => 'Message Sent!']);
});

Route::get('/videos/{user_id}', [VideoController::class, 'getUserVideos']);
Route::middleware([EnsureSessionStored::class])->group(function () {
    Route::get('/home', [HomepagesController::class, 'index'])->name('home.index');
    Route::get('/chating-room', [HomepagesController::class, 'chatingRoom'])->name('home.chat.room');

});

// Route::get('/home', function () {
//     return Inertia::render('Example', [
//         'message' => 'Hello from Laravel!'
//     ]);
// });
