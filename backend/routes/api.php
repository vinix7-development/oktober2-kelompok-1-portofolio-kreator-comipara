<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API KreatorPara
|--------------------------------------------------------------------------
| Autentikasi memakai bearer token (tabel api_tokens). Semua respons JSON.
*/

// Publik
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/meta', [UserController::class, 'meta']);
Route::get('/stats', [UserController::class, 'stats']);

Route::middleware('optional.token')->group(function () {
    Route::get('/feed', [PhotoController::class, 'index']);
    Route::get('/photos', [PhotoController::class, 'index']);
    Route::get('/photos/{photo}', [PhotoController::class, 'show']);
    Route::get('/photos/{photo}/comments', [CommentController::class, 'index']);

    Route::get('/users/{username}', [UserController::class, 'show']);
    Route::get('/users/{username}/photos', [UserController::class, 'photos']);

    Route::get('/direktori', [DirectoryController::class, 'index']);
    Route::get('/directory', [DirectoryController::class, 'index']);

    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);
});

// Butuh login
Route::middleware('auth.token')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'updateProfile']);
    Route::post('/me/creator', [AuthController::class, 'updateCreator']);
    Route::post('/me/avatar', [AuthController::class, 'updateProfile']);

    Route::get('/me/attendances', [AttendanceController::class, 'index']);
    Route::get('/me/notifications', [NotificationController::class, 'index']);
    Route::post('/me/notifications/read', [NotificationController::class, 'readAll']);

    Route::post('/photos', [PhotoController::class, 'store']);
    Route::delete('/photos/{photo}', [PhotoController::class, 'destroy']);
    Route::post('/photos/{photo}/like', [PhotoController::class, 'like']);
    Route::delete('/photos/{photo}/like', [PhotoController::class, 'unlike']);

    Route::post('/photos/{photo}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('/users/{username}/follow', [FollowController::class, 'store']);
    Route::delete('/users/{username}/follow', [FollowController::class, 'destroy']);

    Route::post('/events/{event}/attendance', [AttendanceController::class, 'store']);
    Route::delete('/events/{event}/attendance', [AttendanceController::class, 'destroy']);
});

// Admin
Route::middleware(['auth.token', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/attendances', [AdminController::class, 'attendances']);
    Route::patch('/attendances/{attendance}', [AdminController::class, 'review']);

    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
});
