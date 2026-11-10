<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\User;
use App\Support\Presenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'username' => ['required', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9._]+$/', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'is_creator' => ['sometimes', 'boolean'],
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Nama pengguna wajib diisi.',
            'username.regex' => 'Nama pengguna hanya boleh berisi huruf kecil, angka, titik, dan garis bawah.',
            'username.unique' => 'Nama pengguna sudah dipakai kreator lain.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'username' => strtolower($data['username']),
            'email' => $data['email'],
            'password' => $data['password'],
            'is_creator' => $request->boolean('is_creator'),
        ]);

        $token = ApiToken::issue($user);

        return response()->json([
            'token' => $token,
            'user' => Presenter::user($user->fresh()),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau kata sandi salah.',
            ]);
        }

        Auth::setUser($user);

        return response()->json([
            'token' => ApiToken::issue($user),
            'user' => Presenter::user($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $header = $request->header('Authorization', '');
        if (str_starts_with($header, 'Bearer ')) {
            ApiToken::where('token_hash', hash('sha256', substr($header, 7)))->delete();
        }

        return response()->json(['message' => 'Kamu sudah keluar.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => Presenter::user($request->user(), $request->user()),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'min:2', 'max:80'],
            'bio' => ['nullable', 'string', 'max:280'],
            'username' => ['sometimes', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9._]+$/', Rule::unique('users', 'username')->ignore($user->id)],
            'avatar' => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ], [
            'name.min' => 'Nama minimal 2 karakter.',
            'bio.max' => 'Bio maksimal 280 karakter.',
            'username.unique' => 'Nama pengguna sudah dipakai.',
            'avatar.image' => 'Foto profil harus berupa gambar.',
            'avatar.max' => 'Foto profil maksimal 5 MB.',
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar_path) {
                @unlink(public_path('uploads/'.$user->avatar_path));
            }
            $data['avatar_path'] = $request->file('avatar')->store('avatars', 'uploads');
        }

        $user->update(array_filter($data, fn ($value) => $value !== null));

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => Presenter::user($user->fresh(), $user),
        ]);
    }

    public function updateCreator(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'is_creator' => ['sometimes', 'boolean'],
            'categories' => ['required_if:is_creator,1,true', 'array', 'min:1', 'max:3'],
            'categories.*' => ['string', Rule::in(\App\Models\CreatorProfile::CATEGORIES)],
            'city' => ['nullable', 'string', 'max:80'],
            'commission_open' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:500'],
            'links' => ['nullable', 'array'],
            'links.instagram' => ['nullable', 'string', 'max:120'],
            'links.x' => ['nullable', 'string', 'max:120'],
            'links.website' => ['nullable', 'url', 'max:200'],
            'links.tiktok' => ['nullable', 'string', 'max:120'],
        ], [
            'categories.required_if' => 'Pilih minimal satu kategori kreator.',
            'categories.min' => 'Pilih minimal satu kategori.',
            'categories.max' => 'Maksimal tiga kategori.',
            'categories.*.in' => 'Kategori tidak dikenali.',
            'links.website.url' => 'Tautan website harus berupa URL yang valid.',
        ]);

        $isCreator = $request->has('is_creator')
            ? $request->boolean('is_creator')
            : true;

        $user->is_creator = $isCreator;
        $user->save();

        if ($isCreator && ! empty($data['categories'])) {
            $user->creatorProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'categories' => array_values(array_unique($data['categories'])),
                    'city' => $data['city'] ?? null,
                    'commission_open' => $request->has('commission_open') ? $request->boolean('commission_open') : true,
                    'description' => $data['description'] ?? null,
                    'links' => array_filter($data['links'] ?? []),
                ]
            );
        }

        return response()->json([
            'message' => $isCreator ? 'Profil kreator tersimpan.' : 'Status kreator dimatikan.',
            'user' => Presenter::user($user->fresh(), $user),
        ]);
    }
}
