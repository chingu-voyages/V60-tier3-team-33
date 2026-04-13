<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Notifications\QueuedResetPasswordNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    public function __invoke(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        // Use custom notification to override default one and enable queuing
        $token = Password::getRepository()->create($user);
        $user->notify(new QueuedResetPasswordNotification($token));

        return response()->json([
            'message' => 'Password reset link sent successfully.',
        ]);
    }
}
