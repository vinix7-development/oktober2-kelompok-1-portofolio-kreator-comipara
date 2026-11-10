<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OptionalToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');

        if (str_starts_with($header, 'Bearer ')) {
            $token = ApiToken::with('user')
                ->where('token_hash', hash('sha256', substr($header, 7)))
                ->first();

            if ($token?->user) {
                $request->setUserResolver(fn () => $token->user);
            }
        }

        return $next($request);
    }
}
