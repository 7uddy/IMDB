<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Authenticating the user
Route::post('register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [App\Http\Controllers\AuthController::class, 'user']);
    Route::post('logout', [App\Http\Controllers\AuthController::class, 'logout']);
});

//Movies
Route::get('/movies/trending', [App\Http\Controllers\MovieController::class, 'getTrendingMovies']);
Route::get('/movies/top_rated', [App\Http\Controllers\MovieController::class, 'getTopRatedMovies']);
