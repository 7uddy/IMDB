<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class MovieController extends Controller
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => config('tmdb.base_url'),
            'timeout' => config('tmdb.timeout'),
        ]);
    }

    public function getTrendingMovies(Request $request)
    {
        $response = $this->client->get('movie/popular', [
            'headers' => [
                'Authorization' => config('tmdb.api_key'),
            ],
            'query' => [
                'language' => config('tmdb.language'),
                'page' => 1,
            ],
        ]);
        $movies = json_decode($response->getBody(), true)['results'];

        $limit = $request->header('X-Number-Of-Movies', 20);

        $limitedMovies = array_slice($movies, 0, $limit);

        return response()->json($limitedMovies);
    }

    public function getTopRatedMovies(Request $request)
    {
        $response = $this->client->get('movie/top_rated', [
            'headers' => [
                'Authorization' => config('tmdb.api_key'),
            ],
            'query' => [
                'language' => config('tmdb.language'),
                'page' => 1,
            ],
        ]);
        $movies = json_decode($response->getBody(), true)['results'];

        $limit = $request->header('X-Number-Of-Movies', 20);

        $limitedMovies = array_slice($movies, 0, $limit);

        return response()->json($limitedMovies);
    }
}
