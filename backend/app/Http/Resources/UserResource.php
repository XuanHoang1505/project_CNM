<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'    => $this->id,
            'fullName'  => $this->fullName,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'phoneNumber' => $this->phoneNumber,
            'avatar' => $this->avatar,
            'gender' => $this->gender,
        ];
    }
}
