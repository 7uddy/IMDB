<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Review;
use Symfony\Component\HttpFoundation\Response;

class ReviewApiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_store_a_review()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'movie_id' => '1',
            'movie_title' => 'Test Movie',
            'poster_path' => 'test.jpg',
            'rating' => 8,
            'review_text' => 'Great movie!',
        ];

        $response = $this->postJson('/api/review', $data);

        $response->assertStatus(Response::HTTP_CREATED)
                 ->assertJsonFragment([
                     'movie_id' => '1',
                     'movie_title' => 'Test Movie',
                     'rating' => 8,
                 ]);

        $this->assertDatabaseHas('reviews', [
            'movie_id' => '1',
            'user_id' => $user->id,
            'rating' => 8,
        ]);
    }

    /** @test */
    public function it_can_update_a_review()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $review = Review::factory()->create([
            'user_id' => $user->id,
            'movie_id' => '1',
        ]);

        $data = [
            'movie_id' => '1',
            'movie_title' => 'Test Movie',
            'poster_path' => 'test.jpg',
            'rating' => 9,
            'review_text' => 'Even better movie!',
        ];

        $response = $this->postJson('/api/review', $data);

        $response->assertStatus(Response::HTTP_OK)
                 ->assertJsonFragment([
                     'rating' => 9,
                     'review_text' => 'Even better movie!',
                 ]);

        $this->assertDatabaseHas('reviews', [
            'movie_id' => $review->movie_id,
            'rating' => 9,
            'review_text' => 'Even better movie!',
        ]);
    }

    /** @test */
    public function it_can_delete_a_review()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $review = Review::factory()->create(['movie_id' => '1', 'user_id' => $user->id]);

        $response = $this->deleteJson("/api/review/delete/{$review->movie_id}");

        $response->assertStatus(Response::HTTP_NO_CONTENT);

        $this->assertDatabaseMissing('reviews', [
            'movie_id' => $review->movie_id,
        ]);
    }

    /** @test */
    public function it_can_get_reviews_by_movie_id()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $review1 = Review::factory()->create(['movie_id' => '2', 'user_id' => $user->id]);
        $review2 = Review::factory()->create(['movie_id' => '3', 'user_id' => $user->id]);

        $response = $this->getJson('/api/reviews');

        $response->assertStatus(Response::HTTP_OK)
                 ->assertJsonCount(2);
    }

    /** @test */
    public function it_returns_error_when_review_not_found()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->deleteJson('/api/review/delete/999');

        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    /** @test */
    public function it_can_get_all_users_reviews()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $this->actingAs($user1);

        $review1 = Review::factory()->create(['user_id' => $user1->id, 'movie_id' => '1']);
        $review2 = Review::factory()->create(['user_id' => $user2->id, 'movie_id' => '1']);

        $response = $this->getJson('/api/allreviews/1');

        $response->assertStatus(Response::HTTP_OK)
                 ->assertJsonCount(2);
    }
}
