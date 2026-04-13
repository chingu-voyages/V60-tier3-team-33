<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\QueuedResetPasswordNotification;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

test('users can request password reset link', function () {
    Notification::fake();
    $user = User::factory()->create();

    $response = $this->postJson('/api/forgot-password', [
        'email' => $user->email,
    ]);

    $response->assertOk()
        ->assertJson(['message' => 'Password reset link sent successfully.']);

    Notification::assertSentTo($user, QueuedResetPasswordNotification::class);
});

test('users can reset password with token', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $token = Password::broker()->createToken($user);

    $response = $this->postJson('/api/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertOk()
        ->assertJson(['message' => 'Password reset successfully.']);

    $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
});
