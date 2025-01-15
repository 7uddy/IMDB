<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authenticating the user
Route::post('register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [App\Http\Controllers\AuthController::class, 'login']);

// Movies
Route::get('/movies/trending', [App\Http\Controllers\MovieController::class, 'getTrendingMovies']);
Route::get('/movies/top_rated', [App\Http\Controllers\MovieController::class, 'getTopRatedMovies']);
Route::get('/movies/{id}', [App\Http\Controllers\MovieController::class, 'getMovieDetails']);
Route::get('/movies/page/{page}', [App\Http\Controllers\MovieController::class, 'getMoviesByPage']);
Route::get('/movies/page/{page}/search/{search}', [App\Http\Controllers\MovieController::class, 'searchMovieByText']);
Route::get('/movies/page/{page}/genre/{genre}/sort/{sort}', [App\Http\Controllers\MovieController::class, 'getMoviesByGenreWithSort']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::get('user', [App\Http\Controllers\AuthController::class, 'user']);
    Route::post('logout', [App\Http\Controllers\AuthController::class, 'logout']);

    // Reviews
    Route::post('/review', [App\Http\Controllers\ReviewController::class, 'storeReview']);
    Route::get('/review/{movie_id}', [App\Http\Controllers\ReviewController::class, 'hasUserReviewedMovie']);
    Route::get('/allreviews', [App\Http\Controllers\ReviewController::class, 'getUserReviews']);
});
