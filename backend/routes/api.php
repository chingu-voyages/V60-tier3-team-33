<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', RegisterController::class)->middleware('throttle:auth.register');
Route::post('/login', [LoginController::class, 'login'])->middleware('throttle:auth.login');
Route::post('/forgot-password', ForgotPasswordController::class)->middleware('throttle:auth.password.forgot');
Route::post('/reset-password', ResetPasswordController::class)->middleware('throttle:auth.password.reset');

// Email Verification Routes
Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify'])
    ->middleware(['signed', 'throttle:auth.email.verify'])
    ->name('verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/email/verification-notification', [VerifyEmailController::class, 'resend'])
        ->middleware('throttle:auth.email.resend');

    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    });

    Route::get('/test/users/{user}', function (User $user) {
        return new UserResource($user);
    });

    Route::post('/logout', [LoginController::class, 'logout']);
});
