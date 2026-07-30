<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::query()->where('is_available', true)->get();
        return response()->json($cars, 200);
    }

    public function getAgencyCars(Request $request)
    {
        $cars = Car::query()->where('user_id', $request->user()->id)->get();
        
        return response()->json($cars, 200);
    }

  
    public function store(Request $request)
    {
        $profile = $request->user()->profile;
        if (!$profile || !$profile->city || !$profile->phone) {
            return response()->json([
                'message' => 'Veuillez compléter votre profil avant d\'ajouter une voiture.',
            ], 403);
        }

        if ($request->has('category')) {
            $request->merge(['category' => strtolower($request->category)]);
        }
        if ($request->has('transmission')) {
            $transmissionLower = strtolower($request->transmission);
            $normalizedTransmission = (str_contains($transmissionLower, 'man') || $transmissionLower === 'manuelle') ? 'manual' : 'automatic';
            $request->merge(['transmission' => $normalizedTransmission]);
        }
        if ($request->has('fuel_type')) {
            $request->merge(['fuel_type' => strtolower($request->fuel_type)]);
        }

        if ($request->has('daily_rate') && !$request->has('price_per_day')) {
            $request->merge(['price_per_day' => $request->daily_rate]);
        } elseif ($request->has('price') && !$request->has('price_per_day')) {
            $request->merge(['price_per_day' => $request->price]);
        }

        $request->merge([
            'agency_name' => $request->user()->name,
            'city'        => $profile->city,
        ]);

        $validated = $request->validate([
            'brand'         => 'required|string|max:255',
            'model'         => 'required|string|max:255',
            'year'          =>  'required|integer|min:1900|max:2030',
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
            $car = Car::query()->where('id', $id)->where('user_id', $request->user()->id)->first();

            if (!$car) {
                return response()->json(['message' => 'Car not found or unauthorized!'], 404);
            }

            if ($request->has('category')) {
                $request->merge(['category' => strtolower($request->category)]);
            }
            if ($request->has('transmission')) {
                $transmissionLower = strtolower($request->transmission);
                $normalizedTransmission = (str_contains($transmissionLower, 'man') || $transmissionLower === 'manuelle') ? 'manual' : 'automatic';
                $request->merge(['transmission' => $normalizedTransmission]);
            }
            if ($request->has('fuel_type')) {
                $request->merge(['fuel_type' => strtolower($request->fuel_type)]);
            }

            $request->merge([
                'agency_name' => $request->user()->name,
                'city' => $request->user()->profile?->city ?? 'Casablanca',
            ]);

            $validated = $request->validate([
                'brand'         => 'sometimes|required|string|max:255',
                'model'         => 'sometimes|required|string|max:255',
                'year'         => 'sometimes|required|integer|min:1900|max:2030',
                'price_per_day' => 'sometimes|required|integer|min:1',
                'category'      => 'sometimes|required|in:economique,suv,luxe,electrique',
                'transmission'  => 'sometimes|required|in:manual,automatic',
                'fuel_type'     => 'sometimes|required|in:essence,diesel,electric,hybride',
                'city'          => 'sometimes|required|string|max:255',
                'agency_name'   => 'sometimes|required|string|max:255',
                'seats'         => 'nullable|integer',
                'image'         => 'nullable',
            ]);

            if ($request->hasFile('image')) {
                if ($car->image && Storage::disk('public')->exists($car->image)) {
                    Storage::disk('public')->delete($car->image);
                }
                $path = $request->file('image')->store('cars', 'public');
                $validated['image'] = $path;
            } else {
                unset($validated['image']);
            }

            $car->update($validated);

            return response()->json([
                'message' => 'Car updated successfully!',
                'car'     => $car
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }
}

