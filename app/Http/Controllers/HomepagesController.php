<?php

namespace App\Http\Controllers;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class HomepagesController extends Controller
{
    public function Index(Request $request){
        return Inertia::render('Layouts/Layout');
    }

    public function chatingRoom(Request $request){
        $messages = Message::orderBy('created_at', 'desc')->get();

        return Inertia::render('ChatRoom', [
            'messages' => $messages
        ]);
    }

    public function chatStore(Request $request)
    {
        $message = $request->message;
        $storeMsg = Message::create([
            'message' => $message,
            'user_id' => Session::get('session_id'),
        ]);
        event(new \App\Events\MessageSent($message));
        return response()->json([
            'success' => true,
            'message' => 'Message stored successfully',
            'data' => $storeMsg,
        ]);
    }
}
