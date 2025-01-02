<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function login($username, $password)
    {
        $user = User::where('username', $username)->where('password', $password)->first();
        if ($user) {
            return response()->json([
                'message' => 'Login successful',
                'user' => $user
            ]);
        } else {
            return response()->json([
                'message' => 'Login failed'
            ]);
        }
    }

}
