<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $message;
    public $roomId;


    public function __construct($message, $roomId)
    {
        $this->message = $message;
        $this->roomId = $roomId;

    }


    public function broadcastOn()
    {
        return new Channel("chat-room-{$this->roomId}");
    }

    public function broadcastAs()
    {
        return "MessageSent";
    }
}
