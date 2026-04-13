<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('non-existent api route returns route not found', function () {
    $response = $this->getJson('/api/invalid-route');

    $response->assertNotFound()
        ->assertJson([
            'message' => 'Route not found.',
        ]);
});

test('model not found returns custom message', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    // Use extreme ID to trigger ModelNotFoundException
    $response = $this->getJson('/api/test/users/999999', [
        'Authorization' => 'Bearer ' . $token,
    ]);

    $response->assertNotFound()
        ->assertJson([
            'message' => 'User not found.',
        ]);
});

test('unauthenticated route returns unauthenticated message', function () {
    $response = $this->getJson('/api/user');

    $response->assertUnauthorized()
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});
