<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\Interfaces\UserServiceInterface;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    protected $userService;
    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->userService->register($request->validated());

        return response()->json($result, 201);
    }

    public function verifyEmailOtp(VerifyOtpRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->userService->verifyEmailOtp($data['email'], $data['otp']);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->userService->login($request->validated());

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message'],
            ], 401);
        }

        return response()->json([
            'message' => $result['message'],
            'user' => $result['user'],
            'access_token' => $result['token'],
        ], 200);
    }

    public function logout(): JsonResponse
    {
        Log::info('Logout attempt');
        Log::info('Headers: ' . json_encode(request()->headers->all()));
        
        try {
            $token = JWTAuth::getToken();
            Log::info('Token: ' . $token);
            
            if (!$token) {
                Log::error('Token not found in request');
                return response()->json([
                    'success' => false,
                    'message' => 'Token không tồn tại',
                ], 401);
            }

            JWTAuth::invalidate($token);
            Log::info('Logout successful');

            return response()->json([
                'success' => true,
                'message' => 'Đăng xuất thành công!',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đăng xuất thất bại: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->userService->sendPasswordResetOtp($request->validated()['email']);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function verifyResetPasswordOtp(VerifyOtpRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->userService->verifyResetPasswordOtp($data['email'], $data['otp']);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->userService->resetPassword($data['email'], $data['new_password']);

        return response()->json($result, $result['success'] ? 200 : 400);
    }

    public function resendOtp(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->userService->resendOtp($request->validated()['email']);

        $statusCode = $result['success'] ? 200 : 
            (isset($result['code']) && $result['code'] === 'RATE_LIMIT' ? 429 : 400);

        return response()->json($result, $statusCode);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->userService->changePassword($data['email'], $data['password'], $data['new_password']);

        return response()->json($result, $result['success'] ? 200 : 400);
    }
}
