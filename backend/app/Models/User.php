<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'email',
        'password',
        'fullName',
        'status',
        'role',
        'phoneNumber',
        'gender',
        'avatar',
        'isVerified',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'ADMIN';
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'email' => $this->email,
        ];
    }

    /**
     * Get the name of the unique identifier for the user.
     * MongoDB uses _id instead of id
     */
    public function getAuthIdentifierName()
    {
        return '_id';
    }

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->password;
    }
}