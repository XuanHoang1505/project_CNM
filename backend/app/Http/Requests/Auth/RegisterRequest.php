<?php
namespace App\Http\Requests\Auth;
use App\Http\Requests\BaseRequest;


class RegisterRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Vui lòng nhập tên.',
            'email.required'    => 'Vui lòng nhập email.',
            'email.unique'      => 'Email đã tồn tại.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.confirmed'=> 'Xác nhận mật khẩu không khớp.',
        ];
    }
}