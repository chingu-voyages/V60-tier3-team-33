<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Chingu Job Tracker',
        'version' => app()->version(),
    ]);
});
