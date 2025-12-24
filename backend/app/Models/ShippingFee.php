<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ShippingFee extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'shipping_fees';

    protected $fillable = [
        'province_code',
        'province_name',
        'ward_code',
        'ward_name',
        'fee',
        'note'
    ];

    protected $casts = [
        'fee' => 'double',
    ];
}
