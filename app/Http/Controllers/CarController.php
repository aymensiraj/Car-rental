<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    /**
     * 🌍 جلب كاع السيارات المتاحة فـ الـ Catalogue (للمستخدمين كاملين)
     */
    public function index()
    {
        $cars = Car::query()->where('is_available', true)->get();
        return response()->json($cars, 200);
    }

    /**
     * 🔒 جلب السيارات الخاصة بالوكالة لّي ملوݣية دابا (فصفحة Garage)
     * 🔥 حل مشكل 404
     */
    public function getAgencyCars(Request $request)
    {
        // كنفتشو على السيارات لّي الـ user_id ديالهم هو الـ ID ديال الوكالة الملوݣية
        $cars = Car::query()->where('user_id', $request->user()->id)->get();
        
        return response()->json($cars, 200);
    }

  
    public function store(Request $request)
    {
        
        if ($request->has('category')) {
            $request->merge(['category' => strtolower($request->category)]);
        }
        if ($request->has('transmission')) {
            // إيلا صيفط React كلمة "manuelle" أو "manual" كنرجعوها "manual"
            $trans = strtolower($request->transmission);
            $request->merge(['transmission' => (str_contains($trans, 'man')) ? 'manual' : 'automatic']);
        }
        if ($request->has('fuel_type')) {
            $request->merge(['fuel_type' => strtolower($request->fuel_type)]);
        }

        // إيلا كان الـ React كيصيفط "daily_rate" أو "price"، كنرجعوه "price_per_day"
        if ($request->has('daily_rate') && !$request->has('price_per_day')) {
            $request->merge(['price_per_day' => $request->daily_rate]);
        } elseif ($request->has('price') && !$request->has('price_per_day')) {
            $request->merge(['price_per_day' => $request->price]);
        }

        // تعبئة تلقائية للحقول لّي ما كايناش ف الـ UI
        $request->merge([
            'agency_name' => $request->user()->name, // كياخد اسم الوكالة الملوݣية ديريكت
            'city'        => $request->user()->city ?? 'Casablanca', // كياخد مدينتها أو ديفو كازا
        ]);

        
        $validated = $request->validate([
            'brand'         => 'required|string|max:255',
            'model'         => 'required|string|max:255',
            'price_per_day' => 'required|integer|min:1',
            'category'      => 'required|in:economique,suv,luxe,electrique',
            'transmission'  => 'required|in:manual,automatic',
            'fuel_type'     => 'required|in:essence,diesel,electric',
            'city'          => 'required|string|max:255',
            'agency_name'   => 'required|string|max:255',
            'seats'         => 'nullable|integer', 
            'image'         => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

       
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cars', 'public');
            $validated['image'] = $path;
        }

        $validated['user_id'] = $request->user()->id;
        $validated['is_available'] = true;
        $validated['rating'] = 5.0;

        $car = Car::create($validated);

        return response()->json([
            'message' => 'Car published successfully!',
            'car'     => $car
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        
        $car = Car::query()->find($id);

        
        if (!$car) {
            return response()->json([
                'message' => 'Car not found!'
            ], 404);
        }

      
        if ($car->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized! You cannot delete this car.'
            ], 403);
        }

      
        if ($car->image && Storage::disk('public')->exists($car->image)) {
            Storage::disk('public')->delete($car->image);
        }

       
        $car->delete();

        return response()->json([
            'message' => 'Car deleted successfully from garage!'
        ], 200);
    }

    
    public function show($id)
    {
       
        $car = Car::query()->find($id);

      
        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        return response()->json($car);
    }


    public function update(Request $request, $id)
    {
        try {
            // قلب على السيارة
            $car = Car::query()->where('id', $id)->where('user_id', $request->user()->id)->first();

            if (!$car) {
                return response()->json(['message' => 'Car not found or unauthorized!'], 404);
            }

            // تحويل الحقول لتفادي المشاكل
            if ($request->has('category')) {
                $request->merge(['category' => strtolower($request->category)]);
            }
            if ($request->has('transmission')) {
                $trans = strtolower($request->transmission);
                $request->merge(['transmission' => (str_contains($trans, 'man')) ? 'manual' : 'automatic']);
            }
            if ($request->has('fuel_type')) {
                $request->merge(['fuel_type' => strtolower($request->fuel_type)]);
            }

            // التعبئة التلقائية باش نهنيو راسنا
            $request->merge([
                'agency_name' => $request->user()->name,
                'city'        => $request->user()->city ?? 'Casablanca',
            ]);

            // الـ Validation
            $validated = $request->validate([
                'brand'         => 'sometimes|required|string|max:255',
                'model'         => 'sometimes|required|string|max:255',
                'price_per_day' => 'sometimes|required|integer|min:1',
                'category'      => 'sometimes|required|in:economique,suv,luxe,electrique',
                'transmission'  => 'sometimes|required|in:manual,automatic',
                'fuel_type'     => 'sometimes|required|in:essence,diesel,electric,hybride', // زدنا hybride احتياط
                'city'          => 'sometimes|required|string|max:255',
                'agency_name'   => 'sometimes|required|string|max:255',
                'seats'         => 'nullable|integer',
                'image'         => 'nullable', // رديناها nullable ومفتوحة باش ما ترفضش الـ string القديم
            ]);

            // التعامل مع الصورة
            if ($request->hasFile('image')) {
                if ($car->image && Storage::disk('public')->exists($car->image)) {
                    Storage::disk('public')->delete($car->image);
                }
                $path = $request->file('image')->store('cars', 'public');
                $validated['image'] = $path;
            } else {
                // إيلا مابدلش الصورة، نخليو القديمة
                unset($validated['image']);
            }

            // حفظ التعديلات
            $car->update($validated);

            return response()->json([
                'message' => 'Car updated successfully!',
                'car'     => $car
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // 🔥 إيلا كان خطأ ف الـ Validation غايرجع ليك 422 وتشوف الحقل لّي خاسر بـالظبط!
            return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // 🔥 إيلا كان شي كراش آخر غيصيفط ليك رسالة واضحة شنو فيها
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

}

