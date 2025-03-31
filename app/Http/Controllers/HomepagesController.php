<?php

namespace App\Http\Controllers;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use App\Models\Room;

class HomepagesController extends Controller
{
    public function Index(Request $request){
        return Inertia::render('Layouts/Layout');
    }

    public function chatingRoom(Request $request)
{
    $roomDetails = Room::where('user_id', Session::get('session_id'))->get();

    return Inertia::render('MakeRoom', [
        'rooms' => $roomDetails
    ]);
}


    public function chatStore(Request $request)
    {
        $message = $request->message;
        $roomId = $request->roomId; // Get the room ID
        $storeMsg = Message::create([
            'message' => $message,
            'user_id' => Session::get('session_id'),
            'room_no' => $request->roomId,
        ]);
        event(new \App\Events\MessageSent($message,$roomId));
        return response()->json([
            'success' => true,
            'message' => 'Message stored successfully',
            'data' => $storeMsg,
        ]);
    }

    public function chatingRoomJoin(Request $request){
        return Inertia::render('ChatRoom');
    }

    public function chatingRoomDetails(Request $request)
    {
        if ($request->room_name) {
            $roomNo = strtoupper(Str::random(18));
            $referUrl = url("/room/$roomNo");
            $newRoom = Room::create([
                'member_count' => $request->member_count,
                'name' => $request->room_name,
                'user_id' => Session::get('session_id'),
                'room_no' => $roomNo,
                'refer_url' => $referUrl,
            ]);

            // Return room details in JSON response
            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'room' => $newRoom
            ], 201);
        }else{
            $roomId = $request->room_id;
            $roomDetails = Room::where('room_no', $roomId)->first();
            if (!$roomDetails) {
                return redirect()->back()->with('error', 'Room not found!');
            }
            return response()->json([
                'success' => true,
                'message' => 'Room found',
                'join_url' => route('room.join', ['roomId' => $request->room_id])
            ], 200);
         }

        return response()->json(['success' => false, 'message' => 'Room name is required'], 400);
    }
}
