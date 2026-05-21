<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

Route::get('/', [HomeController::class, 'index']);

Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/logout', [AuthController::class, 'logout']);
Route::get('/api/user', [AuthController::class, 'user']);

Route::middleware('auth')->group(function () {
    Route::get('/api/tasks', [TaskController::class, 'index']);
    Route::post('/api/tasks', [TaskController::class, 'store']);
    Route::patch('/api/tasks/{task}/toggle', [TaskController::class, 'toggleComplete']);
});