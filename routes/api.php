<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

// ✅ Public routes — بلا auth
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/register-agency', [UserController::class, 'registerAgency']);

Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{id}', [CarController::class, 'show']);

// ✅ Protected routes — خاصهم token
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user()->load('profile'),
            'role' => $request->user()->role
        ]);
    });
    Route::post('/logout', [UserController::class, 'logout']);
    Route::match(['PUT', 'POST'], '/user/profile', [UserController::class, 'updateProfile']);

    // Admin
    Route::get('/admin/dashboard-stats',       [AdminController::class, 'dashboardStats']);
    Route::get('/admin/agencies',              [AdminController::class, 'getAgencies']);
    Route::get('/admin/users',                 [AdminController::class, 'getUsers']);
    Route::delete('/admin/accounts/{id}',      [AdminController::class, 'deleteAccount']);
    Route::put('/admin/agencies/{id}/approve', [AdminController::class, 'approveAgency']);
    Route::delete('/admin/agencies/{id}/reject', [AdminController::class, 'rejectAgency']);

    // Orders
    Route::get('/agency/dashboard-stats', [OrderController::class, 'agencyDashboardStats']);
    Route::get('/orders',                 [OrderController::class, 'index']);
    Route::get('/orders/{id}/pdf', [OrderController::class, 'generatePdf']);
    Route::post('/orders',                [OrderController::class, 'store']);
    Route::put('/orders/{id}/accept',     [OrderController::class, 'acceptOrder']);
    Route::put('/orders/{id}/refuse',     [OrderController::class, 'refuseOrder']);

    // Cars (agency)
    Route::get('/agency/cars',                    [CarController::class, 'getAgencyCars']);
    Route::post('/cars',                          [CarController::class, 'store']);
    Route::match(['PUT', 'POST'], '/cars/{id}',   [CarController::class, 'update']);
    Route::delete('/cars/{id}',                   [CarController::class, 'destroy']);
});