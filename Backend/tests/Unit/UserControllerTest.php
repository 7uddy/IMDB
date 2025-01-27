<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_login_successfully()
    {
        $user = User::factory()->create([
            'email' => 'test@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->json('POST', '/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(Response::HTTP_OK)
                 ->assertJson([
                     'message' => 'Login successful',
                 ]);
    }

    /** @test */
    public function it_fails_to_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@user.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->json('POST', '/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword', // Incorrect password
        ]);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED)
                 ->assertJson([
                     'error' => 'Invalid credentials',
                 ]);
    }

    /** @test */
    public function it_can_get_a_username_by_id()
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/username/{$user->id}");

        $response->assertStatus(Response::HTTP_OK)
                 ->assertJson([
                     'username' => $user->name,
                 ]);
    }

    /** @test */
    public function it_returns_error_when_user_not_found_by_id()
    {
        $response = $this->getJson('/api/username/999');

        $response->assertStatus(Response::HTTP_NOT_FOUND)
                 ->assertJson([
                     'message' => 'User not found',
                 ]);
    }

    /** @test */
    public function it_can_get_user_by_username()
    {
        $user = User::factory()->create([
            'name' => 'TestUser',
        ]);

        $response = $this->getJson("/api/user/TestUser");

        $response->assertStatus(Response::HTTP_OK)
                 ->assertJson([
                     'user' => [
                         'id' => $user->id,
                         'name' => $user->name,
                     ],
                 ]);
    }

    /** @test */
    public function it_returns_error_when_user_not_found_by_username()
    {
        $response = $this->getJson('/api/user/NonExistentUser');

        $response->assertStatus(Response::HTTP_NOT_FOUND)
                 ->assertJson([
                     'message' => 'User not found',
                 ]);
    }
}
