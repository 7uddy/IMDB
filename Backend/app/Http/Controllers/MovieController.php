<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

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

    public function getMovieDetails($id)
    {
        $response = $this->client->get("movie/{$id}", [
            'headers' => [
                'Authorization' => config('tmdb.api_key'),
            ],
            'query' => [
                'language' => config('tmdb.language'),
            ],
        ]);
        $movie = json_decode($response->getBody(), true);

        return response()->json($movie);
    }

    public function getMoviesByPage($page)
    {
        $response = $this->client->get('movie/now_playing', [
            'headers' => [
                'Authorization' => config('tmdb.api_key'),
            ],
            'query' => [
                'language' => config('tmdb.language'),
                'page' => $page,
            ],
        ]);
        $movies = json_decode($response->getBody(), true)['results'];

        return response()->json($movies);
    }

    public function searchMovieByText($page, $search)
    {
        $response = $this->client->get('search/movie', [
            'headers' => [
                'Authorization' => config('tmdb.api_key'),
            ],
            'query' => [
                'language' => config('tmdb.language'),
                'page' => $page,
                'query' => $search,
            ],
        ]);
        $movies = json_decode($response->getBody(), true)['results'];

        return response()->json($movies);
    }

    public function getMoviesByGenreWithSort($page, $genre,$sort)
    {
        switch (strtolower($sort)) {
            case 'year_desc':
                $sort = 'primary_release_date.desc';
                break;
            case 'year_asc':
                $sort = 'primary_release_date.asc';
                break;
            case 'title_asc':
                $sort = 'title.asc';
                break;
            case 'title_desc':
                $sort = 'title.desc';
                break;
            default:
                $sort = 'popularity.desc';
                break;
        }

        switch (strtolower($genre)){
            case 'action':
                $genre = 28;
                break;
            case 'comedy':
                $genre = 35;
                break;
            case 'drama':
                $genre = 18;
                break;
            case 'horror':
                $genre = 27;
                break;
            case 'sci_fi':
                $genre = 878;
                break;
            case 'fantasy':
                $genre = 14;
                break;
            default:
                $genre = 28;
                break;
        }

        $response = $this->client->get('discover/movie', [
            'headers' => [
                'Authorization' => config('tmdb.api_key'),
            ],
            'query' => [
                'language' => config('tmdb.language'),
                'page' => $page,
                'sort_by' => $sort,
                'with_genres' => $genre,
            ],
        ]);
        $movies = json_decode($response->getBody(), true)['results'];

        return response()->json($movies);
    }
}
