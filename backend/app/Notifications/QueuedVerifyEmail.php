<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class QueuedVerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->view('emails.auth-email', [
                'title' => 'Email Verification',
                'greeting' => 'Hi ' . $notifiable->name . '!',
                'introLines' => [
                    'Thanks for signing up for Chingu Job Tracker! Before you get started, we need you to verify your email address.',
                    'Please click the button below to verify your account. This link will expire after its first use.',
                ],
                'actionText' => 'Verify Email Address',
                'actionUrl' => $verificationUrl,
                'outroLines' => [
                    'If you did not create an account, no further action is required.',
                    'Best regards, The Chingu team.',
                ],
            ]);
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        $token = Str::random(64);
        
        // Save the token to ensure one-time use
        $notifiable->forceFill([
            'verification_token' => $token,
        ])->save();

        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
                'token' => $token,
            ]
        );
    }
}
