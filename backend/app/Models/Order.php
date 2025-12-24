<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    use Notifiable;
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'order_code',
        'user_id',
        'customer_info',
        'shipping_address',
        'items',
        'payment_method',
        'payment_status',
        'order_status',
        'subtotal',
        'discount',
        'delivery_fee',
        'total',
        'vnpay_transaction',
        'note',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function routeNotificationForMail()
    {
        return $this->customer_info['email'] ?? null;
    }

}