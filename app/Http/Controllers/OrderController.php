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
        } 
       
        else {
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
        $order = Order::findOrFail($id);
        $order->update(['status' => 'accepte']); 

        return response()->json([
            'success' => true,
            'message' => 'Commande acceptée avec succès'
        ]);
    }

   
    public function refuseOrder($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'refuse']); 

        return response()->json([
            'success' => true,
            'message' => 'Commande refusée'
        ]);
    }

    public function store(Request $request)
    {
        // 1. الـ Validation ديال البيانات لي صيفطنا من الـ Cart
        $request->validate([
            'car_id'     => 'required|exists:cars,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        // 2. جلب بيانات السيارة باش نعرفو التمن ديالها للنهار
        $car = Car::findOrFail($request->car_id);

        // 3. حساب عدد الأيام بـ استخدام Carbon
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        
        // إيلا كان نفس النهار (الفرق 0) كنعبروها 1 يوم
        $totalDays = $startDate->diffInDays($endDate);
        $totalDays = $totalDays == 0 ? 1 : $totalDays;

        // 4. حساب الثمن الإجمالي
        $totalPrice = $totalDays * $car->price_per_day;

        // 5. تسجيل الـ Order بجميع الحقول الإجبارية
        $order = Order::create([
            'user_id'     => Auth::id(),
            'car_id'      => $request->car_id,
            'start_date'  => $request->start_date,
            'end_date'    => $request->end_date,
            'total_days'  => $totalDays,   // ✅ داز ناضي
            'total_price' => $totalPrice,  // ✅ داز ناضي
            'status'      => 'en_attente', // ✅ متطابق مع الـ enum ديال الـ Migration
        ]);

        // 6. نرجعو Response زوينة بلي كولشي داز ناضي
        return response()->json([
            'success' => true,
            'message' => 'Réservation créée avec succès !',
            'order'   => $order
        ], 201);
    }

    /**
     * 📊 جلب إحصائيات لوحة التحكم الخاصة بالوكالة
     */
    public function agencyDashboardStats(Request $request)
    {
        $user = Auth::user();

        // 1️⃣ حساب الـ KPIs الأساسية
        // رجعو بحال هكا:
        $fleetSize = Car::query()->where('user_id', $user->id)->count();
        
        $totalOrders = Order::whereHas('car', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();
        
        // رجعو بحال هكا:
        $pendingOrders = Order::query()->where('status', 'en_attente')
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count();
   
        // رجعو بحال هكا:
        $revenue = Order::query()->where('status', 'accepte')
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->sum('total_price');

        // 2️⃣ توزيع الحالات (PieChart)
       // رجعهم بحال هكا:
        $accepted = Order::query()->where('status', 'accepte')->whereHas('car', function ($q) use ($user) { $q->where('user_id', $user->id); })->count();
        $pending = Order::query()->where('status', 'en_attente')->whereHas('car', function ($q) use ($user) { $q->where('user_id', $user->id); })->count();
        $refused = Order::query()->where('status', 'refuse')->whereHas('car', function ($q) use ($user) { $q->where('user_id', $user->id); })->count();
        
        $statusDistribution = [
            ['name' => 'Acceptées', 'value' => $accepted],
            ['name' => 'En attente', 'value' => $pending],
            ['name' => 'Refusées', 'value' => $refused],
        ];

        // 3️⃣ الأرباح الشهرية لآخر 5 أشهر (AreaChart)
        // 🛠️ رجّع الـ سطر 149 بحال هكا:
        $monthlyRevenueRaw = Order::query()->where('status', 'accepte')
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

        $monthTranslations = ['Jan'=>'Jan', 'Feb'=>'Fév', 'Mar'=>'Mar', 'Apr'=>'Avr', 'May'=>'Mai', 'Jun'=>'Jun', 'Jul'=>'Jul', 'Aug'=>'Aoû', 'Sep'=>'Sep', 'Oct'=>'Oct', 'Nov'=>'Nov', 'Dec'=>'Déc'];
        
        $monthlyRevenue = $monthlyRevenueRaw->map(function ($item) use ($monthTranslations) {
            return [
                'month' => $monthTranslations[$item->month] ?? $item->month,
                'revenue' => (float) $item->revenue
            ];
        });

        // 4️⃣ آخر 5 طلبات دازو للوكالة
        $recentOrdersRaw = Order::with(['user', 'car'])
            ->whereHas('car', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentOrders = $recentOrdersRaw->map(function ($order) {
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

        // 5️⃣ إرجاع الـ JSON ناضي ومطابق للـ Front-end
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

    public function update(Request $request, $id)
{
    $car = Car::findOrFail($id);

    // 🔒 حماية: تأكد بلي الوكالة لّي باغية تـموديفيي هي مولات الطوموبيل فعلياً
    if ($car->user_id !== Auth::id()) {
        return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
    }

    // 📝 الـ Validation
    $request->validate([
        'brand'         => 'required|string|max:255',
        'model'         => 'required|string|max:255',
        'price_per_day' => 'required|numeric|min:0',
        'status'        => 'required|string', // متل available, rented...
        'image'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // nullable حيت ماشي ديما غيبدل الصورة
    ]);

    $data = $request->except('image');

    // 📸 إيلا الوكالة أبلودات تصويرة جديدة
    if ($request->hasFile('image')) {
       
        if ($car->image && Storage::disk('public')->exists($car->image)) {
            Storage::disk('public')->delete($car->image);
        }

        // نخزنو التصويرة الجديدة
        $path = $request->file('image')->store('cars', 'public');
        $data['image'] = $path;
    }

    // تحديث البيانات ف الداتابيز
    $car->update($data);

    return response()->json([
        'success' => true,
        'message' => 'Voiture modifiée avec succès !',
        'car'     => $car
    ]);
}
public function generatePdf($id)
{
    // ✅ قبل token من query string أو من session
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


