<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

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

    protected function makeApiCall($endpoint, $params = [])
    {
        try {
            $response = $this->client->get($endpoint, [
                'headers' => [
                    'Authorization' => config('tmdb.api_key'),
                ],
                'query' => array_merge([
                    'language' => config('tmdb.language'),
                ], $params),
            ]);
            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            Log::error('API Request failed: ' . $e->getMessage());
            return null;
        }
    }

    protected function limitMovies($movies, $limit)
    {
        return array_slice($movies, 0, $limit);
    }

    public function getTrendingMovies(Request $request)
    {
        $movies = $this->makeApiCall('movie/popular');
        $limit = $request->header('X-Number-Of-Movies', 20);
        $limitedMovies = $this->limitMovies($movies['results'], $limit);

        return response()->json($limitedMovies, Response::HTTP_OK);
    }

    public function getTopRatedMovies(Request $request)
    {
        $movies = $this->makeApiCall('movie/top_rated');
        $limit = $request->header('X-Number-Of-Movies', 20);
        $limitedMovies = $this->limitMovies($movies['results'], $limit);

        return response()->json($limitedMovies, Response::HTTP_OK);
    }

    public function getMovieDetails($id)
    {
        $movie = $this->makeApiCall("movie/{$id}");

        if (!$movie) {
            return response()->json(['error' => 'Movie not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($movie, Response::HTTP_OK);
    }

    public function getMoviesByPage($page)
    {
        $movies = $this->makeApiCall('movie/now_playing', ['page' => $page]);

        if (!$movies) {
            return response()->json(['error' => 'No movies found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($movies['results']);
    }

    public function searchMovieByText($page, $search)
    {
        $movies = $this->makeApiCall('search/movie', [
            'page' => $page,
            'query' => $search,
        ]);

        if(!$movies) {
            return response()->json(['error' => 'No movies found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($movies['results'], Response::HTTP_OK);
    }

    public function getMoviesByGenreWithSort($page, $genre, $sort)
    {
        $genreId = $this->getGenreId($genre);

        $sortOption = $this->getSortOption($sort);

        $movies = $this->makeApiCall('discover/movie', [
            'page' => $page,
            'sort_by' => $sortOption,
            'with_genres' => $genreId,
        ]);

        if (!$movies) {
            return response()->json(['error' => 'No movies found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($movies['results'], Response::HTTP_OK);
    }

    protected function getGenreId($genre)
    {
        $genres = [
            'action' => 28,
            'comedy' => 35,
            'drama' => 18,
            'horror' => 27,
            'sci_fi' => 878,
            'fantasy' => 14,
        ];

        return $genres[strtolower($genre)] ?? 28;
    }

    protected function getSortOption($sort)
    {
        $sortOptions = [
            'year_desc' => 'primary_release_date.desc',
            'year_asc' => 'primary_release_date.asc',
            'title_asc' => 'title.asc',
            'title_desc' => 'title.desc',
        ];

        return $sortOptions[strtolower($sort)] ?? 'popularity.desc';
    }
}
