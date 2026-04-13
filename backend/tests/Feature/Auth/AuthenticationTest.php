<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('users can authenticate', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'message',
            'access_token',
            'token_type',
            'user',
        ]);
});

test('users cannot authenticate with wrong password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('authenticated users can logout and revoke all tokens', function () {
    $user = User::factory()->create();
    $user->createToken('token-1');
    $token2 = $user->createToken('token-2')->plainTextToken;

    $response = $this->postJson('/api/logout', [], [
        'Authorization' => 'Bearer ' . $token2,
    ]);

    $response->assertOk()
        ->assertJson(['message' => 'User logged out successfully.']);

    $this->assertCount(0, $user->tokens);
});
