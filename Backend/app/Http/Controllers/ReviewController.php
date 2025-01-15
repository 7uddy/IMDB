<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;


class ReviewController extends Controller
{
    public function storeReview(Request $request)
    {
        $request->merge(['user_id' => Auth::user()->id]);

        $validated=$request->validate([
            'movie_id' => 'required|string',
            'movie_title' => 'required|string',
            'poster_path' => 'required|string',
            'user_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:10',
            'review_text' => 'required|string',
        ]);

        $review = Review::create([
            'movie_id' => $validated['movie_id'],
            'movie_title' => $validated['movie_title'],
            'poster_path' => $validated['poster_path'],
            'user_id' => $validated['user_id'],
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'],
        ]);

        return response()->json($review,Response::HTTP_CREATED);
    }
}
