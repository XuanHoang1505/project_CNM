<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class UpdateUserRequest extends BaseRequest
{
    // UpdateUserRequest.php
    public function prepareForValidation()
    {
        // Chuyển đổi tên trường frontend thành tên trường trong database
        if ($this->has('fullName')) {
            $this->merge([
                'full_name' => $this->get('fullName'),
            ]);
        }

        if ($this->has('phoneNumber')) {
            $this->merge([
                'phone_number' => $this->get('phoneNumber'),
            ]);
        }

        if ($this->has('gender')) {
            $this->merge([
                'gender' => is_null($this->gender) ? null : (int)$this->gender,
            ]);
        }
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        return [
            'full_name' => 'sometimes|nullable|string|max:255',  
            'email' => "sometimes|nullable|email|max:255|unique:users,email,{$userId}",
            'gender' => 'sometimes|nullable|in:0,1',
            'phone_number' => 'sometimes|nullable|string|max:15',
            'status' => 'sometimes',
            'role' => 'sometimes|nullable|in:ADMIN,USER',
            'avatar' => 'sometimes|nullable|file|mimes:jpg,jpeg,png|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'The email has already been taken by another user.',
            'avatar.mimes' => 'The avatar must be a file of type: jpg, jpeg, png.',
            'avatar.max' => 'The avatar may not be greater than 2048 kilobytes.',
            'phone_number.max' => 'The phone number may not be greater than 15 characters.',
        ];
    }
}
