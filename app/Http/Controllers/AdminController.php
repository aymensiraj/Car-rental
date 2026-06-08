<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Car;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class AdminController extends Controller
{
    public function dashboardStats()
    {
        $usersCount    = User::query()->where('role', 'user')->count();
        $agenciesCount = User::query()->where('role', 'agency')->count();
        $carsCount   = Car::count();
        $ordersCount = Order::count();

        $totalRevenue = Order::query()->where('status', 'accepte')->sum('total_price');

        $monthlyRevenue = DB::table('orders')
            ->selectRaw('DATE_FORMAT(created_at, "%b") as month, SUM(total_price) as revenue')
            ->where('status', 'accepte')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupByRaw('DATE_FORMAT(created_at, "%Y%m"), DATE_FORMAT(created_at, "%b")')
            ->orderByRaw('DATE_FORMAT(created_at, "%Y%m")')
            ->get();

        $ordersByStatus = [
            ['name' => 'Accepté',    'value' => Order::query()->where('status', 'accepte')->count()],
            ['name' => 'En attente', 'value' => Order::query()->where('status', 'en_attente')->count()],
            ['name' => 'Refusé',     'value' => Order::query()->where('status', 'refuse')->count()],
        ];

        $carsByCategory = DB::table('cars')
            ->select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->get()
            ->map(function ($c) {
                return ['category' => ucfirst($c->category), 'count' => $c->total];
            });

        $thisMonth = Order::query()->where('status', 'accepte')
            ->whereMonth('created_at', now()->month)
            ->sum('total_price');

        $lastMonth = Order::query()->where('status', 'accepte')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->sum('total_price');

        $monthlyGrowth = $lastMonth > 0
            ? round((($thisMonth - $lastMonth) / $lastMonth) * 100)
            : 8;

        $eliteAgencies = User::query()->where('role', 'agency')
            ->with('profile')
            ->withCount('cars')
            ->get()
            ->map(function ($a) {
                return [
                    'id'         => $a->id,
                    'name'       => $a->name,
                    'email'      => $a->email,
                    'city'       => $a->profile ? $a->profile->city : null,
                    'logo'       => $a->profile ? $a->profile->logo : null,
                    'cars_count' => $a->cars_count,
                    'rating'     => '5.0',
                ];
            });

        return response()->json([
            'usersCount'     => $usersCount,
            'agenciesCount'  => $agenciesCount,
            'carsCount'      => $carsCount,
            'ordersCount'    => $ordersCount,
            'totalRevenue'   => $totalRevenue,
            'monthlyGrowth'  => $monthlyGrowth,
            'monthlyRevenue' => $monthlyRevenue,
            'ordersByStatus' => $ordersByStatus,
            'carsByCategory' => $carsByCategory,
            'eliteAgencies'  => $eliteAgencies,
        ]);
    }

    public function getAgencies()
    {
        $agencies = User::where('role', 'agency')
            ->with('profile')
            ->withCount('cars')
            ->get();

        return response()->json([
            'agencies' => $agencies->where('status', 'active')->values(),
            'pending'  => $agencies->where('status', 'pending')->values(),
        ]);
    }

    public function getUsers()
    {
        $users = User::query()->where('role', 'user')
            ->with('profile')
            ->get();

        return response()->json(['users' => $users]);
    }

    public function deleteAccount($id)
    {
        $user = User::query()->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }

    public function approveAgency($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'active']);
        return response()->json(['success' => true, 'message' => 'Agence approuvée']);
    }

    public function rejectAgency($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['success' => true, 'message' => 'Agence rejetée']);
    }
}