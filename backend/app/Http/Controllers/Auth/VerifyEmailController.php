<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verify(Request $request, $id, $hash): RedirectResponse
    {
        $user = User::findOrFail($id);
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        // 1. Verify the hash matches (security check)
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->away($frontendUrl . '/email-verification?status=failed&reason=invalid_hash');
        }

        // 2. Verify the one-time token matches (One-time use check)
        if (!$request->has('token') || $user->verification_token !== $request->token) {
            return redirect()->away($frontendUrl . '/email-verification?status=failed&reason=link_expired_or_already_used');
        }

        // 3. Mark as verified if not already
        if ($user->hasVerifiedEmail()) {
            // Even if already verified, clear the token to be safe if they somehow got a new link
            $user->forceFill(['verification_token' => null])->save();
            return redirect()->away($frontendUrl . '/email-verification?status=success');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // 4. Invalidate the token (Make it single-use)
        $user->forceFill(['verification_token' => null])->save();

        return redirect()->away($frontendUrl . '/email-verification?status=success');
    }

    /**
     * Resend the email verification notification.
     */
    public function resend(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent successfully.']);
    }
}
