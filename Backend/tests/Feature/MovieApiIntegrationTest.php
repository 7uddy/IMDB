<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MovieApiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_get_trending_movies_from_the_api()
    {
        $response = $this->json('GET', '/api/movies/trending');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            '*' => [
                'id',
                'title',
                'backdrop_path',
                'vote_average',
                'overview',
                'release_date',
            ]
        ]);
    }

    /** @test */
    public function it_can_get_movie_details_from_the_api()
    {
        $response = $this->json('GET', '/api/movies/939243');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'title',
            'backdrop_path',
            'vote_average',
            'overview',
            'release_date',
        ]);
    }

    /** @test */
    public function it_returns_error_for_nonexistent_movie()
    {
        $response = $this->json('GET', '/api/movies/1');

        $response->assertStatus(404);
        $response->assertJson([
            'error' => 'Movie not found',
        ]);
    }

    /** @test */
    public function it_can_search_movies_by_text()
    {
        $response = $this->json('GET', '/api/movies/page/1/search/avengers');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id', 'title'],
        ]);
    }

    /** @test */
    public function it_can_get_movies_by_genre_and_sorting()
    {
        $response = $this->json('GET', '/api/movies/page/1/genre/action/sort/year_desc');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id', 'title', 'genre_ids'],
        ]);
    }
}
