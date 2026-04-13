<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\ResetPassword;

class QueuedResetPasswordNotification extends ResetPassword implements ShouldQueue
{
    use Queueable;

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = url(config('app.url').route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->view('emails.auth-email', [
                'title' => 'Reset Your Password',
                'greeting' => 'Hello!',
                'introLines' => [
                    'You are receiving this email because we received a password reset request for your account.',
                ],
                'actionText' => 'Reset Password',
                'actionUrl' => $url,
                'outroLines' => [
                    'This password reset link will expire in '.config('auth.passwords.'.config('auth.defaults.passwords').'.expire').' minutes.',
                    'If you did not request a password reset, no further action is required.',
                ],
            ]);
    }
}
