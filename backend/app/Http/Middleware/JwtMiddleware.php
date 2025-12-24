<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            // Kiểm tra token có hợp lệ không
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            if ($e instanceof TokenInvalidException) {
                return response()->json(['message' => 'Token không hợp lệ'], 401);
            } elseif ($e instanceof TokenExpiredException) {
                return response()->json(['message' => 'Token đã hết hạn'], 401);
            } else {
                return response()->json(['message' => 'Token không được tìm thấy'], 401);
            }
        }

        return $next($request);
    }
}
