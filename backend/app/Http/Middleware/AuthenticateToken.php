<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');

        if (! str_starts_with($header, 'Bearer ')) {
            return response()->json(['message' => 'Silakan masuk terlebih dahulu.'], 401);
        }

        $plain = substr($header, 7);
        $token = ApiToken::with('user')
            ->where('token_hash', hash('sha256', $plain))
            ->first();

        if (! $token || ! $token->user) {
            return response()->json(['message' => 'Sesi tidak valid. Silakan masuk kembali.'], 401);
        }

        if ($token->expires_at && $token->expires_at->isPast()) {
            $token->delete();

            return response()->json(['message' => 'Sesi sudah berakhir. Silakan masuk kembali.'], 401);
        }

        $token->forceFill(['last_used_at' => now()])->save();

        $request->setUserResolver(fn () => $token->user);
        auth()->setUser($token->user);

        return $next($request);
    }
}
