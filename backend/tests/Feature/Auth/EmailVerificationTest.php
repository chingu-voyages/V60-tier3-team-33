<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\QueuedVerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('registration sends email verification notification', function () {
    Notification::fake();

    $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $user = User::where('email', 'test@example.com')->first();

    Notification::assertSentTo($user, QueuedVerifyEmail::class);
});

test('email can be verified with signed url and token', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
        'verification_token' => $token = Str::random(64),
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->email),
            'token' => $token,
        ]
    );

    $response = $this->get($verificationUrl);

    $response->assertRedirect(env('FRONTEND_URL') . '/email-verification?status=success');
    $this->assertTrue($user->refresh()->hasVerifiedEmail());
    $this->assertNull($user->verification_token);
});

test('email cannot be verified with invalid token (one-time use)', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
        'verification_token' => 'correct-token',
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->email),
            'token' => 'correct-token',
        ]
    );

    // Simulate link already used by changing token in DB
    $user->update(['verification_token' => 'new-token']);

    $response = $this->get($verificationUrl);

    $response->assertRedirect(env('FRONTEND_URL') . '/email-verification?status=failed&reason=link_expired_or_already_used');
});

test('email cannot be verified with invalid signature', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
        'verification_token' => 'token',
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->email),
            'token' => 'token',
        ]
    );

    // Tamper with url
    $tamperedUrl = $verificationUrl . 'tampered';

    $response = $this->get($tamperedUrl);

    // Laravel's 'signed' middleware throws 403 or redirects depending on expectations
    // For API it usually throws 403 or handled by our generic 403 handler
    $response->assertForbidden();
});
