<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Events\ChatMessageEvent;


class ReviewController extends Controller
{
    public function storeReview(Request $request)
    {
        $request->merge(['user_id' => Auth::user()->id]);

        $validated = $request->validate([
            'movie_id' => 'required|string',
            'movie_title' => 'required|string',
            'poster_path' => 'required|string',
            'user_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:10',
            'review_text' => 'required|string',
        ]);

        $review = Review::where('user_id', $validated['user_id'])
            ->where('movie_id', $validated['movie_id'])
            ->first();

        if($review){
            $review->update([
                'rating' => $validated['rating'],
                'review_text' => $validated['review_text'],
            ]);

            event(new ChatMessageEvent(
                Auth::user()->name,
                $validated['rating'],
                $validated['review_text'],
                $validated['movie_id']
            ));

            return response()->json($review, Response::HTTP_OK);
        }

        $review = Review::create([
            'movie_id' => $validated['movie_id'],
            'movie_title' => $validated['movie_title'],
            'poster_path' => $validated['poster_path'],
            'user_id' => $validated['user_id'],
            'rating' => $validated['rating'],
            'review_text' => $validated['review_text'],
        ]);

        event(new ChatMessageEvent(
            Auth::user()->name,
            $validated['rating'],
            $validated['review_text'],
            $validated['movie_id']
        ));

        return response()->json($review, Response::HTTP_CREATED);
    }

    public function hasUserReviewedMovie(Request $request,$movie_id)
    {
        $user_id = Auth::user()->id;

        $review = Review::where('user_id', $user_id)
            ->where('movie_id', $movie_id)
            ->first();

        return response()->json($review, Response::HTTP_OK);
    }

    public function getUserReviews()
    {
        $user_id = Auth::user()->id;

        $reviews = Review::where('user_id', $user_id)
            ->get();

        return response()->json($reviews, Response::HTTP_OK);
    }

    public function deleteReview(Request $request,$movie_id)
    {
        $user_id = Auth::user()->id;

        $review = Review::where('user_id', $user_id)
            ->where('movie_id', $movie_id)
            ->first();

        if($review){
            $review->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        }

        return response()->json(null, Response::HTTP_NOT_FOUND);
    }

    public function getReviewsByMovieId($movie_id)
    {
        $reviews = Review::where('movie_id', $movie_id)
            ->get();

        return response()->json($reviews, Response::HTTP_OK);
    }

    public function getReviewsByUserId($user_id)
    {
        $reviews = Review::where('user_id', $user_id)
            ->get();

        return response()->json($reviews, Response::HTTP_OK);
    }
}
