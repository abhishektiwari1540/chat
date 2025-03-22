<?php

namespace App\Http\Controllers;
use App\Events\MessageSent;

use Illuminate\Http\Request;
use Inertia\Inertia;


class HomepagesController extends Controller
{
    public function Index(Request $request){
        return Inertia::render('Layouts/Layout');
    }

    public function chatingRoom(Request $request){
        $message = $request->input('message');

        // Broadcast the message

        event(new \App\Events\MessageSent("Hello from Tinker!"));

        broadcast(new MessageSent($message))->toOthers();
                return Inertia::render('ChatRoom');
    }
}
