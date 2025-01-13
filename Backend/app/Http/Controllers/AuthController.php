<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function Register(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'password' => 'required|string',
        ]);

        if (User::where('email', $validated['email'])->exists()) {
            return response()->json(['error' => 'Email already taken'], 422);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return response()->json($user, 201);
    }

    public function Login(Request $request)
    {
        if(!Auth::attempt($request->only('email', 'password')))
        {
            return response()->json([
                'error' => 'Invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user=Auth::user();
        $token=$user->createToken('token')->plainTextToken;
        $cookie=cookie('jwt', $token, 60*24); // 1 day
        return response()->json([
            'message' => "Login successful"
        ])->withCookie($cookie);
    }

    public function Logout()
    {
        $cookie=Cookie::forget('jwt');
        Auth::user()->tokens()->delete();
        return response()->json([
            'message' => "Logout successful"
        ])->withCookie($cookie);
    }

    public function User()
    {
        return Auth::user();
    }
}
