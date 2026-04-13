<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

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
        return (new MailMessage)
            ->subject('Welcome to Chingu Job Tracker!')
            ->view('emails.auth-email', [
                'title' => 'Welcome Aboard!',
                'greeting' => 'Hi ' . $notifiable->name . '!',
                'introLines' => [
                    'We\'re excited to have you join Chingu Job Tracker. You successfully created an account.',
                    'Start tracking your job applications and take control of your career journey today.',
                ],
                'actionText' => 'Go to Dashboard',
                'actionUrl' => config('app.url'),
                'outroLines' => [
                    'If you have any questions, feel free to reply to this email.',
                    'Best regards, The Chingu team.',
                ],
            ]);
    }
}
