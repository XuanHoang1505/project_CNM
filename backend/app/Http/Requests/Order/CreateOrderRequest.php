<?php

namespace App\Http\Requests\Order;

use App\Http\Requests\BaseRequest;

class CreateOrderRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
             'user_id' => 'nullable|integer|exists:users,id',
            'customer_info.fullName' => 'required|string',
            'customer_info.email' => 'required|email',
            'customer_info.phone' => 'required|string',

            'house_number' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'note' => 'nullable|string|max:1000',

            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|integer|min:0', 
            'items.*.size' => 'nullable|string|max:50',
            'items.*.color' => 'nullable|string|max:50',
            'items.*.image' => 'nullable|string|max:500',

            'payment_method' => 'required|string|in:cod,vnpay,momo',
            'subtotal' => 'required|integer|min:0', 
            'discount' => 'nullable|integer|min:0', 
            'delivery_fee' => 'required|integer|min:0', 
            'total' => 'required|integer|min:0', 
        ];
    }

    public function messages(): array
    {
        return [
            // Customer info
            'full_name.required' => 'Vui lòng nhập họ tên.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',

            // Shipping address
            'house_number.required' => 'Vui lòng nhập số nhà/địa chỉ.',
            'province.required' => 'Vui lòng chọn tỉnh/thành phố.',
            'ward.required' => 'Vui lòng chọn phường/xã.',

            // Items
            'items.required' => 'Đơn hàng phải có ít nhất 1 sản phẩm.',
            'items.min' => 'Đơn hàng phải có ít nhất 1 sản phẩm.',
            'items.*.product_id.required' => 'Thiếu ID sản phẩm.',
            'items.*.product_id.exists' => 'Sản phẩm không tồn tại.',
            'items.*.product_name.required' => 'Thiếu tên sản phẩm.',
            'items.*.quantity.required' => 'Thiếu số lượng sản phẩm.',
            'items.*.quantity.min' => 'Số lượng phải ít nhất là 1.',
            'items.*.price.required' => 'Thiếu giá sản phẩm.',
            'items.*.price.min' => 'Giá sản phẩm không hợp lệ.',

            // Payment
            'payment_method.required' => 'Vui lòng chọn phương thức thanh toán.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
            'subtotal.required' => 'Thiếu tổng tiền hàng.',
            'delivery_fee.required' => 'Thiếu phí giao hàng.',
            'total.required' => 'Thiếu tổng tiền đơn hàng.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'full_name' => 'họ tên',
            'email' => 'email',
            'phone' => 'số điện thoại',
            'house_number' => 'số nhà',
            'province' => 'tỉnh/thành',
            'ward' => 'phường/xã',
            'items' => 'sản phẩm',
            'payment_method' => 'phương thức thanh toán',
            'subtotal' => 'tổng tiền hàng',
            'discount' => 'giảm giá',
            'delivery_fee' => 'phí giao hàng',
            'total' => 'tổng tiền',
        ];
    }
}