<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra user đã login chưa
        if (!auth('api')->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login.'
            ], 401);
        }

        // Kiểm tra có phải admin không
        if (!auth('api')->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Admin access required.'
            ], 403);
        }

        return $next($request);
    }
}