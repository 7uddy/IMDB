<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Review;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition()
    {
        return [
            'movie_id' => $this->faker->word,
            'movie_title' => $this->faker->sentence,
            'poster_path' => $this->faker->sentence,
            'user_id' => User::factory(),
            'rating' => $this->faker->numberBetween(1, 10),
            'review_text' => $this->faker->paragraph,
        ];
    }
}
