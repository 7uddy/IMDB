<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function login($username, $password)
    {
        $user = User::where('username', $username)->where('password', $password)->first();
        if ($user) {
            return response()->json([
                'message' => 'Login successful',
                'user' => $user
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                'message' => 'Login failed'
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function getUsername($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json([
                'username' => $user->name
            ],Response::HTTP_OK);
        } else {
            return response()->json([
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }
    }

}
