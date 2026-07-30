<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
        public function login(Request $request)
        {
            $credentials = $request->validate([
                'email'    => 'required|email',
                'password' => 'required',
            ]);

            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                if ($user->role === 'agency' && $user->status === 'pending') {
                    Auth::logout();
                    return response()->json(['message' => 'pending'], 403);
                }

                $user->load('profile');
                $token = $user->createToken('main')->plainTextToken;

                return response()->json([
                    'user' => $user,
                    'role' => $user->role
                ], 200)->cookie('auth_token', $token, 60 * 24, '/', null, false, true);
            }

            return response()->json(['message' => 'Email or password incorrect'], 401);
        }


        
        public function logout(Request $request)
        {
            try {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            } catch (\Exception $e) {}

            return response()->json(['success' => true])
                ->withCookie(cookie('auth_token', '', -1, '/', null, false, true))
                ->withCookie(cookie('laravel_session', '', -1, '/', null, false, true))
                ->withCookie(cookie('XSRF-TOKEN', '', -1, '/', null, false, false));
    }

    public function register(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => $user->load('profile'),
                'token' => $token,
            ], 201)->cookie('auth_token', $token, 60 * 24, '/', null, false, true);
        }

        public function registerAgency(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors'  => $validator->errors()
                ], 422);
            }

            User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'agency',
                'status'   => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'status'  => 'pending'
            ], 201);
        }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone'   => 'nullable|string|max:20',
            'city'    => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'logo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

       $updateData = ['name' => $validated['name']];
        if (!empty($validated['email'])) {
            $updateData['email'] = $validated['email'];
        }
        $user->update($updateData);
        
        $profileData = [
            'phone'   => $validated['phone'],
            'city'    => $validated['city'],
            'address' => $validated['address'],
        ];

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            
            $profileData['logo'] = asset('storage/' . $path);
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user'    => $user->load('profile') 
        ], 200);
    }
}
