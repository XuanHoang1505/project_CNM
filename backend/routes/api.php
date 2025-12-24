<?php

use App\Http\Controllers\AddressController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingFeeController;
use App\Http\Controllers\UserController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('verify-email-otp', [AuthController::class, 'verifyEmailOtp']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('verify-otp', [AuthController::class, 'verifyResetPasswordOtp']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    Route::post('resend-otp', [AuthController::class, 'resendOtp']);

    Route::post('change-password', [AuthController::class, 'changePassword']);
});



Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/dress-styles', [ProductController::class, 'dressStyles']); 
Route::get('/brands', [ProductController::class, 'brands']);



Route::prefix('products')->group(function () {
    Route::get('', [ProductController::class, 'index']);
    Route::get('/featured', [ProductController::class, 'featured']);
    Route::get('/new', [ProductController::class, 'newProducts']);
    Route::get('/bestseller', [ProductController::class, 'bestseller']);
    Route::get('/price-range', [ProductController::class, 'getByPriceRange']);
    Route::get('/search', [ProductController::class, 'search'] );
    Route::get('/filters', [ProductController::class, 'filters']); 
    Route::get('/category/{slug}', [ProductController::class, 'getByCategory']);

    Route::get('/{id}/check-stock', [ProductController::class, 'checkStock']);
    Route::get('/{id}', [ProductController::class, 'findById']); 
    Route::get('/slug/{slug}', [ProductController::class, 'findBySlug']); 

    
    // ===== ADMIN ROUTES =====
    // Route::middleware(['auth:api', 'admin'])->group(function () {
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);

    // });
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/by-email', [OrderController::class, 'getOrderByEmail']); 
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/statistics', [OrderController::class, 'statistics']);
    Route::get('/search', [OrderController::class, 'search']);
    Route::get('/code/{orderCode}', [OrderController::class, 'getByOrderCode']);
    Route::get('/user/{userId}', [OrderController::class, 'getUserOrders']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
    Route::patch('/{id}/status', [OrderController::class, 'updateStatus']);
    Route::patch('/{id}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    Route::post('/{id}/cancel', [OrderController::class, 'cancel']);
    Route::post('/{id}/complete', [OrderController::class, 'complete']);
});


Route::prefix('discounts')->group(function () {
      Route::middleware(['auth:api', 'admin'])->group(function () {
        // CRUD operations
    });
});

Route::post('/discounts', [DiscountController::class, 'store']);
Route::get('/discounts/{code}', [DiscountController::class, 'findByCode']);


Route::get('/provinces', [AddressController::class, 'getProvinces']);
Route::get('/provinces/{code}/wards', [AddressController::class, 'getWards']);

Route::post('/reviews', [ReviewController::class, 'createReview']);
Route::get( '/reviews/{productId}', [ReviewController::class,'getProductByIdProduct']);
Route::get( '/review/order/{orderId}', [ReviewController::class,'getReviewByOrderId']);

Route::prefix('admin/users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});

Route::post('/vnpay_payment',[CheckoutController::class,'vnpay_payment']);
Route::get('/vnpay-return', [CheckoutController::class, 'vnpay_return']);
Route::get('/orders/{order_code}', [CheckoutController::class, 'getOrder']);
Route::post('/order-cod', [CheckoutController::class, 'createOrderCOD']);


Route::get('/shipping-fees', [ShippingFeeController::class,'getAll']);

Route::prefix('admin/shipping-fees')->group(function () {
    Route::get('/', action: [ShippingFeeController::class, 'index']);
    Route::post('/', [ShippingFeeController::class, 'store']);
    Route::get('/lookup', [ShippingFeeController::class, 'lookup']);
    Route::get('/{id}', [ShippingFeeController::class, 'show']);
    Route::put('/{id}', [ShippingFeeController::class, 'update']);
    Route::delete('/{id}', [ShippingFeeController::class, 'destroy']);
});