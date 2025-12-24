<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class CreateUserRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'required|in:ADMIN,USER',
            'status' => 'sometimes|in:ACTIVE,DISABLED',
        ];
    }

    public function messages()
    {
        return [
            'fullName.required' => 'Tên người dùng là bắt buộc.',
            'fullName.string' => 'Tên người dùng phải là một chuỗi ký tự.',
            'fullName.max' => 'Tên người dùng không được vượt quá 255 ký tự.',
            'email.required' => 'Email là bắt buộc.',
            'email.string' => 'Email phải là một chuỗi ký tự.',
            'email.email' => 'Email phải có định dạng hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email đã được sử dụng.',
            'role.required' => 'Vai trò là bắt buộc.',
            'role.in' => 'Vai trò không hợp lệ. Chỉ chấp nhận ADMIN hoặc USER.',
            'status.in' => 'Trạng thái không hợp lệ. Chỉ chấp nhận ACTIVE hoặc DISABLED.',
        ];
    }
}
