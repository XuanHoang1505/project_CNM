<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseRequest;

class UpdateUserRequest extends BaseRequest
{
    public function rules(): array
    {
        $userId = $this->route('user')?->id; // Lấy ID từ route model binding

        return [

            'fullName' => 'sometimes|nullable|string|max:255',

            'email' => "sometimes|nullable|email|max:255|unique:users,email,{$userId}",

            'gender' => 'sometimes',

            'phoneNumber' => 'sometimes|nullable|string|max:15',

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
            'phoneNumber.max' => 'The phone number may not be greater than 15 characters.',
        ];
    }
}
