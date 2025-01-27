<?php

namespace App\Http\Controllers;

use App\Events\ChatMessageEvent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $username = $request->input("username");
        $message = $request->input("message");

        event(new ChatMessageEvent($username, $message));
        return response()->json(["status" => "Message Sent"], 200);
    }
}
