<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order; 
use App\Models\Car; 
use Carbon\Carbon;  
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'agency') {
            $orders = Order::with(['car', 'user']) 
                ->whereHas('car', function ($query) use ($user) {
                    $query->where('user_id', $user->id); 
                })
                ->latest()
                ->get();
        } else {
            $orders = Order::with('car')
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        return response()->json([
            'success' => true,
            'orders'  => $orders
        ]);
    }

    public function acceptOrder($id)
    {
        $order = Order::with('car')->findOrFail($id);
        $order->update(['status' => 'accepte']);

    
        $order->car->update(['is_available' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Commande acceptée avec succès'
        ]);
    }

    public function refuseOrder($id)
    {
        $order = Order::with('car')->findOrFail($id);
        $order->update(['status' => 'refuse']);

  
        $order->car->update(['is_available' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Commande refusée'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'car_id'     => 'required|exists:cars,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $car = Car::findOrFail($request->car_id);

        
        if (!$car->is_available) {
            return response()->json([
                'message' => 'Cette voiture n\'est plus disponible.'
            ], 422);
        }

        
        $car->update(['is_available' => false]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        
        $totalDays = $startDate->diffInDays($endDate);
        $totalDays = $totalDays == 0 ? 1 : $totalDays;

        $totalPrice = $totalDays * $car->price_per_day;

        $order = Order::create([
            'user_id'     => Auth::id(),
            'car_id'      => $request->car_id,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
            'total_days'  => $totalDays,
            'total_price' => $totalPrice,
            'status'      => 'en_attente',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation créée avec succès !',
            'order'   => $order
        ], 201);
    }

    public function agencyDashboardStats(Request $request)
    {
        $user = Auth::user();

        $fleetSize = Car::query()->where('user_id', $user->id)->count();
        
        $totalOrders = Order::whereHas('car', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();
        
        $pendingOrders = Order::query()->where('status', 'en_attente')
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count();
        
        $revenue = Order::query()->where('status', 'accepte')
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->sum('total_price');

        $statusDistribution = Order::query()
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($record) {
                $statusNames = [
                    'accepte' => 'Acceptées',
                    'en_attente' => 'En attente',
                    'refuse' => 'Refusées',
                ];
                return [
                    'name' => $statusNames[$record->status] ?? $record->status,
                    'value' => $record->count,
                ];
            })
            ->values()
            ->toArray();

        $monthlyRevenueData = Order::query()->where('status', 'accepte')
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('created_at', '>=', Carbon::now()->subMonths(5)->startOfMonth())
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%b") as month'),
                DB::raw('SUM(total_price) as revenue'),
                DB::raw('MONTH(created_at) as month_num')
            )
            ->groupBy('month', 'month_num')
            ->orderBy('month_num', 'asc')
            ->get();

        $monthNameTranslations = ['Jan'=>'Jan', 'Feb'=>'Fév', 'Mar'=>'Mar', 'Apr'=>'Avr', 'May'=>'Mai', 'Jun'=>'Jun', 'Jul'=>'Jul', 'Aug'=>'Aoû', 'Sep'=>'Sep', 'Oct'=>'Oct', 'Nov'=>'Nov', 'Dec'=>'Déc'];
        
        $monthlyRevenue = $monthlyRevenueData->map(function ($record) use ($monthNameTranslations) {
            return [
                'month' => $monthNameTranslations[$record->month] ?? $record->month,
                'revenue' => (float) $record->revenue
            ];
        });

        $recentOrdersList = Order::with(['user', 'car'])
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentOrders = $recentOrdersList->map(function ($order) {
            return [
                'id' => $order->id,
                'userName' => $order->user ? $order->user->name : 'Client Invité',
                'carBrand' => $order->car ? $order->car->brand : 'N/A', 
                'carModel' => $order->car ? $order->car->model : '',
                'startDate' => Carbon::parse($order->start_date)->format('Y-m-d'),
                'endDate' => Carbon::parse($order->end_date)->format('Y-m-d'),
                'totalPrice' => $order->total_price,
                'status' => $order->status,
            ];
        });

        return response()->json([
            'kpis' => [
                'fleetSize' => $fleetSize,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'revenue' => (float) ($revenue ?? 0),
            ],
            'statusDistribution' => $statusDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'recentOrders' => $recentOrders
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $car = $order->car;

        if ($car->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepte,refuse',
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully!',
            'order'   => $order
        ]);
    }

    public function generatePdf($id)
    {
        $user = auth('sanctum')->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $order = Order::with(['car', 'user'])->findOrFail($id);

        if ($order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $pdf = Pdf::loadView('pdf.order', compact('order'));
        return $pdf->download("reservation-{$order->id}.pdf");
    }
}